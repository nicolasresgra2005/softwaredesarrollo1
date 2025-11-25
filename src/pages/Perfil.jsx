import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Perfil.css";

const Perfil = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [sensores, setSensores] = useState([]);

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

  const obtenerSensores = async (idUsuario) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/users/sensores/${idUsuario}`
      );
      const data = await res.json();
      setSensores(data);
    } catch (error) {
      setMensaje("❌ Error al conectar con el servidor.");
    }
  };

  // AGREGAR SENSOR
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
            Tamano_Lote: tamanoLote,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setMensaje("❌ " + data.error);
        return;
      }

      setMensaje("✅ Sensor agregado correctamente.");

      setNuevoSensor("");
      setNombreLote("");
      setTamanoLote("");

      obtenerSensores(usuario.id);
    } catch (error) {
      setMensaje("❌ No se pudo agregar el sensor.");
    } finally {
      setCargando(false);
    }
  };

  // ELIMINAR SENSOR
  const eliminarSensor = async () => {
    if (!sensorEliminar)
      return setMensaje("⚠️ Ingresa la IP del sensor a eliminar.");

    try {
      const res = await fetch(
        `http://localhost:5000/api/users/sensores/eliminar/${encodeURIComponent(
          sensorEliminar
        )}`,
        { method: "DELETE" }
      );

      const data = await res.json();

      if (!res.ok) return setMensaje("❌ " + data.error);

      setMensaje("🗑️ Sensor eliminado correctamente.");
      setSensorEliminar("");
      obtenerSensores(usuario.id);
    } catch (error) {
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
    <div className="perfil-container">

      <h1>¡ Bienvenido {usuario.nombre}!</h1>

      <div className="perfil-info">
        <p><strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}</p>
        <p><strong>Correo:</strong> {usuario.correo}</p>
      </div>

      {/* SENSORES */}
      <div className="sensor-section">

        <h2>🛰️ Tus Sensores</h2>

        {sensores.length > 0 ? (
          sensores.map((s) => (
            <div key={s.Id_Sensor} className="sensor-item">
              
              <div className="sensor-info">
                <p><strong>ID:</strong> {s.Id_Sensor}</p>
                <p><strong>IP:</strong> {s.Ip_Sensor}</p>
                <p><strong>Nombre lote:</strong> {s.Nombre_Lote}</p>
                <p><strong>Tamaño lote:</strong> {s.Tamaño_Lote}</p>
              </div>

              {/* BOTÓN DE 3 PUNTOS */}
              <button
                className="options-button"
                onClick={() => navigate(`/sensor/${s.Id_Sensor}`)}
              >
                ⋮
              </button>
            </div>
          ))
        ) : (
          <p style={{ color: "#777" }}>
            No tienes sensores asociados todavía.
          </p>
        )}

        {/* AGREGAR SENSOR */}
        <h3 className="subtitulo">➕ Agregar nuevo sensor</h3>

        <input
          type="text"
          placeholder="IP del sensor"
          value={nuevoSensor}
          onChange={(e) => setNuevoSensor(e.target.value)}
        />

        <input
          type="text"
          placeholder="Nombre del lote"
          value={nombreLote}
          onChange={(e) => setNombreLote(e.target.value)}
        />

        <input
          type="text"
          placeholder="Tamaño del lote"
          value={tamanoLote}
          onChange={(e) => setTamanoLote(e.target.value)}
        />

        <button onClick={asociarSensor} disabled={cargando}>
          {cargando ? "Asociando..." : "Asociar Sensor"}
        </button>

        {/* ELIMINAR */}
        <h3 className="subtitulo rojo">🗑️ Eliminar sensor</h3>

        <input
          type="text"
          placeholder="IP del sensor"
          value={sensorEliminar}
          onChange={(e) => setSensorEliminar(e.target.value)}
        />

        <button onClick={eliminarSensor} className="btn-eliminar">
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
        className="cerrar-sesion-btn"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Perfil;
