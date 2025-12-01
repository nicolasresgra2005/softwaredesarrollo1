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

  // ========================
  // 1. Cargar datos del sensor
  // ========================
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
  // 2. Cargar historial de lecturas
  // =============================
  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/users/sensores/datos/${id}`);
        const data = await res.json();
        setDatos(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDatos();
  }, [id]);

  if (mensaje) return <h2 style={{ color: "red", textAlign: "center" }}>{mensaje}</h2>;
  if (!sensor) return <h2 style={{ textAlign: "center" }}>Cargando sensor...</h2>;

  // =============================
  // Preparar datos para gráficas
  // =============================

  const labels = datos.map(d =>
    new Date(d.Fecha_Registro).toLocaleTimeString()
  );

  const humedadData = {
    labels,
    datasets: [
      {
        label: "Humedad",
        data: datos.map(d => d.Nivel_Humedad),
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
        data: datos.map(d => d.Nivel_Temperatura),
        borderColor: "red",
        tension: 0.3
      }
    ]
  };

  // =============================
  // 🔥 RESTAURADO: Control del LED
  // =============================
  const enviarComandoLED = async (cmd) => {
    await fetch("http://192.168.20.13:3000/led", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ comando: cmd })
    });

    alert("Comando enviado: " + cmd);
  };

  return (
    <div className="sensor-container">
      <div className="sensor-card">
        <h1>Sensor {sensor.Id_Sensor}</h1>
        <p><strong>IP:</strong> {sensor.Ip_Sensor}</p>
        <p><strong>Nombre Lote:</strong> {sensor.Nombre_Lote}</p>
        <p><strong>Tamaño Lote:</strong> {sensor.Tamaño_Lote}</p>
      </div>

      {/* 🔥 RESTAURADO: BLOQUE DEL CONTROL LED */}
      <div className="sensor-card">
        <h2>Control LED</h2>

        <button
          onClick={() => enviarComandoLED("ON")}
          style={{ padding: "10px", margin: "5px", background: "green", color: "white" }}
        >
          Encender LED
        </button>

        <button
          onClick={() => enviarComandoLED("OFF")}
          style={{ padding: "10px", margin: "5px", background: "red", color: "white" }}
        >
          Apagar LED
        </button>
      </div>

      <div className="sensor-card">
        <h2>Gráficas</h2>
        <Line data={humedadData} />
        <Line data={temperaturaData} />
      </div>
    </div>
  );
};

export default InterfaceSensor;