import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

import { Line } from "react-chartjs-2";
import "./InterfaceSensor.css";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const InterfaceSensor = () => {
  const { id } = useParams();
  const [sensor, setSensor] = useState(null);
  const [datos, setDatos] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // Estados de límites
  const [tempMin, setTempMin] = useState("");
  const [tempMax, setTempMax] = useState("");
  const [humMin, setHumMin] = useState("");
  const [humMax, setHumMax] = useState("");

  // =============================
  // 🔥 1. Cargar datos del sensor
  // =============================
  useEffect(() => {
    const fetchSensor = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/sensores/detalle/${id}`);
        if (!res.ok) throw new Error("Sensor no encontrado");
        const data = await res.json();
        setSensor(data);
      } catch (error) {
        console.error(error);
        setMensaje("❌ " + error.message);
      }
    };

    fetchSensor();
  }, [id]);

  // =============================
  // 🔥 2. Cargar historial de lecturas
  // =============================
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/sensores/datos/${id}`);
        const data = await res.json();
        setDatos(data);

        if (
          data &&
          data.length > 0 &&
          sensor &&
          humMax &&
          humMin &&
          tempMax &&
          tempMin
        ) {
          const ultima = data[data.length - 1];

          if (ultima.Nivel_Humedad > humMax) {
            enviarCorreo(
              sensor.Correo_Electronico_U,
              "Humedad Alta",
              ultima.Nivel_Humedad,
              humMax
            );
          }

          if (ultima.Nivel_Humedad < humMin) {
            enviarCorreo(
              sensor.Correo_Electronico_U,
              "Humedad Baja",
              ultima.Nivel_Humedad,
              humMin
            );
          }

          if (ultima.Nivel_Temperatura > tempMax) {
            enviarCorreo(
              sensor.Correo_Electronico_U,
              "Temperatura Alta",
              ultima.Nivel_Temperatura,
              tempMax
            );
          }

          if (ultima.Nivel_Temperatura < tempMin) {
            enviarCorreo(
              sensor.Correo_Electronico_U,
              "Temperatura Baja",
              ultima.Nivel_Temperatura,
              tempMin
            );
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchDatos();
  }, [id, sensor, humMax, humMin, tempMax, tempMin]);

  const enviarCorreo = async (correo, tipo, valor, limite) => {
    try {
      await fetch("http://localhost:5000/api/notificaciones/alerta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo,
          tipo,
          valor,
          limite,
          sensorId: id
        })
      });
    } catch (error) {
      console.error("❌ Error enviando correo:", error);
    }
  };

  useEffect(() => {
    const fetchLimites = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/sensores/limites/${id}`);
        if (!res.ok) return;

        const data = await res.json();
        if (data) {
          setTempMin(data.Temp_Min ?? "");
          setTempMax(data.Temp_Max ?? "");
          setHumMin(data.Hum_Min ?? "");
          setHumMax(data.Hum_Max ?? "");
        }
      } catch (error) {
        console.error("Error cargando límites:", error);
      }
    };

    fetchLimites();
  }, [id]);

  if (mensaje) return <h2 style={{ color: "red", textAlign: "center" }}>{mensaje}</h2>;
  if (!sensor) return <h2 style={{ textAlign: "center" }}>Cargando sensor...</h2>;

  if (!datos || datos.length === 0) {
    return (
    <div className="sensor-container">
      <div className="sensor-card">
        <h1>Sensor {sensor.Id_Sensor}</h1>
        <p><strong>IP:</strong> {sensor.Ip_Sensor}</p>
        <p><strong>Nombre Lote:</strong> {sensor.Nombre_Lote}</p>
        <p><strong>Tamaño Lote:</strong> {sensor.Tamaño_Lote}</p>
      </div>

      <div className="sensor-card" style={{ textAlign:"center", fontSize:"18px" }}>
        📭 Este sensor aún no tiene datos registrados.
      </div>
    </div>
  );
}

const labels = datos.map(d => 
  d.Fecha_Registro ? new Date(d.Fecha_Registro).toLocaleTimeString() : ""
);

// =============================
// 🟩 AQUÍ AGREGO LO QUE FALTABA
// =============================
const humedadData = {
  labels,
  datasets: [
    {
      label: "Humedad",
      data: datos.map((d) => d.Nivel_Humedad),
      borderColor: "blue",
      tension: 0.3
    }
  ]
};

const temperaturaData = {
  labels,
  datasets: [
    {
      label: "Temperatura",
      data: datos.map((d) => d.Nivel_Temperatura),
      borderColor: "red",
      tension: 0.3
    }
  ]
};

const enviarComandoLED = async (cmd) => {
  await fetch("http://192.168.20.13:3000/led", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ comando: cmd })
  });

  alert("Comando enviado: " + cmd);
};

const guardarLimites = async () => {
  if (tempMin === "" || tempMax === "" || humMin === "" || humMax === "") {
    setMensaje("⚠️ Debes completar todos los campos de límites.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:5000/api/users/sensores/limites/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tempMin,
        tempMax,
        humMin,
        humMax
      })
    });

    if (!res.ok) throw new Error("Error guardando límites");

    setMensaje("✅ Límites guardados correctamente");
  } catch (error) {
    console.error("❌ Error guardando límites:", error);
    setMensaje("❌ No se pudieron guardar los límites.");
  }
};

return (
  <div className="sensor-container">
    <div className="sensor-card">
      <h1>Sensor {sensor.Id_Sensor}</h1>
      <p><strong>IP:</strong> {sensor.Ip_Sensor}</p>
      <p><strong>Nombre Lote:</strong> {sensor.Nombre_Lote}</p>
      <p><strong>Tamaño Lote:</strong> {sensor.Tamaño_Lote}</p>
    </div>

    <div className="sensor-card">
      <h2 className="titulo-limites">Configurar Límites</h2>

      {mensaje && (
        <div className="limite-mensaje-exito">
          {mensaje}
        </div>
      )}

      <div className="limites-container">
        <label className="limite-label">Temperatura Mínima</label>
        <input type="number" className="limite-input" value={tempMin} onChange={(e) => setTempMin(e.target.value)} />

        <label className="limite-label">Temperatura Máxima</label>
        <input type="number" className="limite-input" value={tempMax} onChange={(e) => setTempMax(e.target.value)} />

        <label className="limite-label">Humedad Mínima</label>
        <input type="number" className="limite-input" value={humMin} onChange={(e) => setHumMin(e.target.value)} />

        <label className="limite-label">Humedad Máxima</label>
        <input type="number" className="limite-input" value={humMax} onChange={(e) => setHumMax(e.target.value)} />
      </div>

      <button className="guardar-btn" onClick={guardarLimites}>Guardar Límites</button>
    </div>

    <div className="sensor-card">
      <h2>Control Motoboma</h2>

      <button onClick={() => enviarComandoLED("ON")} className="btn-led-on">Encender Motobomba</button>
      <button onClick={() => enviarComandoLED("OFF")} className="btn-led-off">Apagar Motobomba</button>
    </div>

    <div className="sensor-card">
      <h2>Gráficas</h2>
      <Line data={humedadData} />
      <Line data={temperaturaData}  />
    </div>
  </div>
);
};

export default InterfaceSensor;