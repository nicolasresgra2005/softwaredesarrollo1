import React, { useEffect, useState } from "react";
import "./Perfil.css";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const [sensores, setSensores] = useState([]);

  // CAMPOS CORRECTOS
  const [nuevoSensor, setNuevoSensor] = useState("");
  const [nombreLote, setNombreLote] = useState("");
  const [tamanoLote, setTamanoLote] = useState("");

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

  // 🔹 OBTENER SENSORES
  const obtenerSensores = async (idUsuario) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/sensores/${idUsuario}`
      );
      if (!res.ok) throw new Error("Error al obtener sensores");
      const data = await res.json();
      setSensores(data);
    } catch (error) {
      console.error(error);
      setMensaje("❌ Error al conectar con el servidor.");
    }
  };

  // 🔹 AGREGAR SENSOR (Nombre_Lote + Tamaño_Lote)
  const asociarSensor = async () => {
    if (!nuevoSensor || !nombreLote || !tamanoLote)
      return setMensaje("⚠️ Completa todos los campos del sensor.");

    setCargando(true);
    setMensaje("");

    try {
      const res = await fetch(
        "http://localhost:5000/api/users/sensores/agregar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Id_Usuario: usuario.id,
            Ip_Sensor: nuevoSensor,
            Nombre_Lote: nombreLote,
            Tamano_Lote: tamanoLote,  // <-- ESTE NOMBRE ES EL CORRECTO
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMensaje("❌ " + data.error);
        return;
      }

      setMensaje("✅ Sensor agregado correctamente.");

      // limpiar inputs
      setNuevoSensor("");
      setNombreLote("");
      setTamanoLote("");

      obtenerSensores(usuario.id);
    } catch (error) {
      console.error(error);
      setMensaje("❌ No se pudo agregar el sensor.");
    } finally {
      setCargando(false);
    }
  };

  // 🔹 ELIMINAR SENSOR
  const eliminarSensor = async () => {
    if (!sensorEliminar)
      return setMensaje("⚠️ Ingresa la IP del sensor a eliminar.");

    try {
      const res = await fetch(
        `http://localhost:5000/api/users/sensores/eliminar/${encodeURIComponent(
          sensorEliminar
        )}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMensaje("❌ " + data.error);
        return;
      }

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

      {/* SECCIÓN SENSORES */}
      <div className="sensor-section" style={{ marginTop: 30 }}>
        <h2 style={{ color: "#1b5e20" }}>🛰️ Tus Sensores</h2>

        {sensores.length > 0 ? (
          sensores.map((s) => (
            <p key={s.Id_Sensor} style={{ fontWeight: "bold", marginTop: 10 }}>
              ID: {s.Id_Sensor} | IP: {s.Ip_Sensor} <br />
              Nombre Lote: {s.Nombre_Lote} | Tamaño del lote: {s.Tamaño_Lote}
            </p>
          ))
        ) : (
          <p style={{ color: "#777" }}>No tienes sensores asociados todavía.</p>
        )}

        {/* AGREGAR SENSOR */}
        <h3 style={{ marginTop: 25, color: "#33691e" }}>➕ Agregar nuevo sensor</h3>

        <input type="text" placeholder="IP del sensor" value={nuevoSensor} onChange={(e) => setNuevoSensor(e.target.value)} /><br />
        <input type="text" placeholder="Nombre del lote" value={nombreLote} onChange={(e) => setNombreLote(e.target.value)} style={{ marginTop: 10 }} /><br />
        <input type="text" placeholder="Tamaño del lote" value={tamanoLote} onChange={(e) => setTamanoLote(e.target.value)} style={{ marginTop: 10 }} /><br />

        <button onClick={asociarSensor} disabled={cargando} style={{ marginTop: 12 }}>
          {cargando ? "Asociando..." : "Asociar Sensor"}
        </button>

        {/* ELIMINAR */}
        <h3 style={{ marginTop: 30, color: "#b71c1c" }}>🗑️ Eliminar sensor</h3>

        <input type="text" placeholder="IP del sensor" value={sensorEliminar} onChange={(e) => setSensorEliminar(e.target.value)} /><br />

        <button onClick={eliminarSensor} style={{ marginTop: 12, background: "#b71c1c" }}>
          Eliminar Sensor
        </button>

        {mensaje && (
          <p style={{ marginTop: 20, color: mensaje.includes("❌") ? "red" : "#1b5e20", fontWeight: "bold" }}>
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
        style={{ marginTop: 40, padding: "10px 18px", borderRadius: 6, background: "#b71c1c", color: "#fff" }}
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Perfil;