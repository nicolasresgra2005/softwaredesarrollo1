import React from "react";

const Perfil = () => {
  
  const usuario = {
    nombre: "Nicolás",
    apellido: "Restrepo",
    correo: "nicolas@gmail.com"
  };

  return (
    <div className="perfil-container" style={{ maxWidth: 800, margin: "40px auto", padding: 20 }}>
      <h1>¡Bienvenido Nicolas!</h1>

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
    </div>
  );
};

export default Perfil;