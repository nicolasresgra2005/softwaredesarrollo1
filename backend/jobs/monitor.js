// backend/jobs/monitor.js
import pool from "../config/db.js";
import { enviarAlertaLimite } from "../controllers/userController.js";

/**
 * startMonitor: inicia un polling que revisa nuevas filas en Datos_Sensor
 * y envía alertas cuando superan los límites.
 *
 * No modifica filas en la BD. Usa la columna Fecha_Registro
 * para detectar filas nuevas (comparando contra lastCheck).
 */

const POLL_INTERVAL_MS = 20_000; // 20 segundos, ajústalo si quieres

let lastCheck = new Date(); // iniciamos desde ahora; solo reacciona a datos nuevos

// 🔥 NUEVO: guardar si ya se envió alerta por sensor (temp / hum)
const alertasEnviadas = {}; 

const startMonitor = () => {
  console.log("🟢 Monitor de lecturas iniciado. Revisa cada", POLL_INTERVAL_MS / 1000, "seg.");

  // 🔍 TEST ENV DESDE MONITOR
  console.log("🔍 TEST ENV DESDE MONITOR:", {
    MAIL_HOST: process.env.MAIL_HOST,
    MAIL_PORT: process.env.MAIL_PORT,
    GMAIL_USER: process.env.GMAIL_USER,
    GMAIL_PASS: process.env.GMAIL_PASS ? "OK" : "VACÍA",
  });

  const run = async () => {
    try {
      // Traer filas nuevas desde lastCheck (strictly greater)
      const q = `
        SELECT d.*, s."Id_Usuario"
        FROM "Datos_Sensor" d
        JOIN "Sensor" s ON d."Id_Sensor" = s."Id_Sensor"
        WHERE d."Fecha_Registro" > $1
        ORDER BY d."Fecha_Registro" ASC
      `;
      const res = await pool.query(q, [lastCheck]);

      if (res.rows.length === 0) {
        return;
      }

      // Procesar filas en orden cronológico
      for (const fila of res.rows) {
        try {
          const {
            Id_Sensor,
            Id_Usuario,
            Nivel_Humedad,
            Nivel_Temperatura,
            Fecha_Registro
          } = fila;

          // Obtener límites del sensor
          const limitesQ = `
            SELECT "Temp_Min","Temp_Max","Hum_Min","Hum_Max"
            FROM "Limite_Sensor"
            WHERE "Id_Sensor" = $1
          `;
          const limitesRes = await pool.query(limitesQ, [Id_Sensor]);

          if (limitesRes.rows.length === 0) {
            console.log(`ℹ Sensor ${Id_Sensor} sin límites configurados. Ignorado.`);
            lastCheck = new Date(Fecha_Registro);
            continue;
          }

          const { Temp_Min, Temp_Max, Hum_Min, Hum_Max } = limitesRes.rows[0];

          // Obtener correo del dueño del sensor
          const userQ = `SELECT "Correo_Electronico_U" FROM "Usuario" WHERE "Id_Usuario" = $1`;
          const userRes = await pool.query(userQ, [Id_Usuario]);
          const correo = userRes.rows[0]?.Correo_Electronico_U;

          if (!correo) {
            console.warn(`⚠ Usuario ${Id_Usuario} sin correo. No se envía alerta.`);
            lastCheck = new Date(Fecha_Registro);
            continue;
          }

          const tempNum = Number(Nivel_Temperatura);
          const humNum = Number(Nivel_Humedad);
          const tMin = Number(Temp_Min);
          const tMax = Number(Temp_Max);
          const hMin = Number(Hum_Min);
          const hMax = Number(Hum_Max);

          // ✔️ ALERTA DE TEMPERATURA (solo una vez)
          if (!Number.isNaN(tempNum) && (!Number.isNaN(tMin) && !Number.isNaN(tMax))) {
            if (tempNum < tMin || tempNum > tMax) {

              // ENVÍA SOLO UNA VEZ
              if (!alertasEnviadas[`${Id_Sensor}-temp`]) {
                console.log(`🚨 Alerta temperatura sensor ${Id_Sensor}: ${tempNum} (límites ${tMin}-${tMax}) -> enviando correo a ${correo}`);
                await enviarAlertaLimite(correo, "Temperatura", tempNum, tMin, tMax);

                alertasEnviadas[`${Id_Sensor}-temp`] = true;
              }

            } else {
              // SI REGRESA A NORMAL, SE RESETEA
              alertasEnviadas[`${Id_Sensor}-temp`] = false;
            }
          }

          // ✔️ ALERTA DE HUMEDAD (solo una vez)
          if (!Number.isNaN(humNum) && (!Number.isNaN(hMin) && !Number.isNaN(hMax))) {
            if (humNum < hMin || humNum > hMax) {

              if (!alertasEnviadas[`${Id_Sensor}-hum`]) {
                console.log(`🚨 Alerta humedad sensor ${Id_Sensor}: ${humNum} (límites ${hMin}-${hMax}) -> enviando correo a ${correo}`);
                await enviarAlertaLimite(correo, "Humedad", humNum, hMin, hMax);

                alertasEnviadas[`${Id_Sensor}-hum`] = true;
              }

            } else {
              alertasEnviadas[`${Id_Sensor}-hum`] = false;
            }
          }

          lastCheck = new Date(Fecha_Registro);

        } catch (filaErr) {
          console.error("❌ Error procesando fila del monitor:", filaErr);
        }
      }

    } catch (err) {
      console.error("❌ Error en job monitor:", err);
    }
  };

  run();
  setInterval(run, POLL_INTERVAL_MS);
};

export default startMonitor;