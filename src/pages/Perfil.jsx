import React, { useEffect, useState } from "react";
import "./Perfil.css";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // 🔹 Recuperamos los datos del usuario guardado en el login
    const userData = localStorage.getItem("usuario");
    if (userData) {
      setUsuario(JSON.parse(userData));
    }
  }, []);

  // 🔹 Si no hay usuario, mostramos mensaje
  if (!usuario) {
    return <h2 style={{ textAlign: "center", marginTop: 50 }}>Ops, al parecer no has iniciado sesión</h2>;
  }

  return (
    <div className="perfil-container" style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <h1>¡Bienvenido {usuario.nombre}!</h1>

      <div className="perfil-info" style={{ marginTop: 20, textAlign: "left" }}>
        <p><strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}</p>
        <p><strong>Correo:</strong> {usuario.correo}</p>
      </div>

      <div className="sensor-section" style={{ marginTop: 30, textAlign: "center" }}>
        <h2>Asociar Sensor</h2>
        <p>Por ahora esta función estará disponible en el siguiente sprint.</p>
        <input type="text" placeholder="ID del sensor" style={{ padding: 8, borderRadius: 6, width: 240 }} />
        <br />
        <button disabled style={{ marginTop: 12, padding: "8px 16px", borderRadius: 6, background: "#2e7d32", color: "#fff", border: "none" }}>
          Asociar Sensor
        </button>
      </div>

      {/* 🔹 Botón de cierre de sesión */}
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
          display: "block",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default Perfil;
