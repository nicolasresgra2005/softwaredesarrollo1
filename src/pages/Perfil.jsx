import React, { useEffect, useState } from "react";
import './Perfil.css'

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [sensores, setSensores] = useState([]);
  const [nuevoSensor, setNuevoSensor] = useState("");
  const [sensorEliminar, setSensorEliminar] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) {
      const user = JSON.parse(userData);
      setUsuario(user);
      obtenerSensores(user.id);
    }
  }, []);

  // 🟩 Obtener sensores del usuario
  const obtenerSensores = async (idUsuario) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/sensores/${idUsuario}`);
      if (!res.ok) throw new Error("Error al obtener sensores");
      const data = await res.json();
      setSensores(data);
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al conectar con el servidor.");
    }
  };

  // 🟢 Asociar nuevo sensor (CORREGIDO)
  const asociarSensor = async () => {
    if (!nuevoSensor) return setMensaje("⚠️ Ingresa un ID de sensor.");

    setCargando(true);
    setMensaje("");

    try {
      const res = await fetch("http://localhost:5000/api/users/sensores/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Id_Usuario: usuario.id,
          Ip_Sensor: nuevoSensor
        }),
      });

      if (!res.ok) throw new Error("Error al agregar el sensor");

      setMensaje("✅ Sensor agregado correctamente.");
      setNuevoSensor("");
      obtenerSensores(usuario.id);

    } catch (error) {
      console.error(error);
      setMensaje("❌ No se pudo agregar el sensor.");
    } finally {
      setCargando(false);
    }
  };

  // 🔴 Eliminar sensor (CORREGIDO)
  const eliminarSensor = async () => {
    if (!sensorEliminar) return setMensaje("⚠️ Ingresa el ID del sensor a eliminar.");

    try {
      const res = await fetch(`http://localhost:5000/api/users/sensores/eliminar/${sensorEliminar}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar sensor");

      setMensaje("🗑️ Sensor eliminado correctamente.");
      setSensorEliminar("");
      obtenerSensores(usuario.id);

    } catch (error) {
      console.error(error);
      setMensaje("❌ No se pudo eliminar el sensor.");
    }
  };

  if (!usuario) {
    return (
      <h2 style={{ textAlign: "center", marginTop: 50 }}>
        Ops, al parecer no has iniciado sesión
      </h2>
    );
  }

  return (
    <div className="perfil-container" style={{ maxWidth: 800, margin: "40px auto", padding: 20, textAlign: "center" }}>
      <h1 style={{ color: "#1b5e20" }}>¡ Bienvenido {usuario.nombre}!</h1>

      <div className="perfil-info" style={{ marginTop: 20, textAlign: "left" }}>
        <p><strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}</p>
        <p><strong>Correo:</strong> {usuario.correo}</p>
      </div>

      <div className="sensor-section" style={{ marginTop: 30 }}>
        <h2 style={{ color: "#1b5e20" }}>🛰️ Tus Sensores</h2>

        {sensores.length === 0 ? (
          <p>No tienes sensores asociados todavía.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {sensores.map((s) => (
              <li key={s.id_sensor} style={{ margin: "8px 0", borderBottom: "1px solid #ccc" }}>
                <strong>ID:</strong> {s.id_sensor} | <strong>IP:</strong> {s.ip_sensor}
              </li>
            ))}
          </ul>
        )}

        <h3 style={{ marginTop: 25, color: "#33691e" }}>➕ Agregar nuevo sensor</h3>
        <input
          type="text"
          placeholder="ID del sensor"
          value={nuevoSensor}
          onChange={(e) => setNuevoSensor(e.target.value)}
          style={{ padding: 8, borderRadius: 6, width: 240, border: "1px solid #777" }}
        />
        <br />
        <button
          onClick={asociarSensor}
          disabled={cargando}
          style={{
            marginTop: 12,
            padding: "8px 16px",
            borderRadius: 6,
            background: "#2e7d32",
            color: "#fff",
            border: "none",
            cursor: cargando ? "wait" : "pointer",
          }}
        >
          {cargando ? "Asociando..." : "Asociar Sensor"}
        </button>

        <h3 style={{ marginTop: 30, color: "#b71c1c" }}>🗑️ Eliminar sensor</h3>
        <input
          type="text"
          placeholder="ID del sensor"
          value={sensorEliminar}
          onChange={(e) => setSensorEliminar(e.target.value)}
          style={{ padding: 8, borderRadius: 6, width: 240, border: "1px solid #777" }}
        />
        <br />
        <button
          onClick={eliminarSensor}
          style={{
            marginTop: 12,
            padding: "8px 16px",
            borderRadius: 6,
            background: "#b71c1c",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Eliminar Sensor
        </button>

        {mensaje && (
          <p
            style={{
              marginTop: 20,
              color: mensaje.includes("❌") ? "red" : "#1b5e20",
              fontWeight: "bold",
            }}
          >
            {mensaje}
          </p>
        )}
      </div>

      <button
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
          window.location.href = "/login";
        }}
        style={{
          marginTop: 40,
          padding: "10px 18px",
          borderRadius: 6,
          background: "#b71c1c",
          color: "#fff",
          border: "none",
          cursor: "pointer",
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Perfil;