import React from "react";

const Perfil = () => {
  // Por ahora simulamos un usuario logueado
  const usuario = {
    nombre: "Nicolás",
    apellido: "Restrepo",
    correo: "nicolas@gmail.com"
  };

  return (
    <div className="perfil-container">
      <h1>Perfil del Usuario</h1>
      <div className="perfil-info">
        <p><strong>Nombre:</strong> {usuario.nombre} {usuario.apellido}</p>
        <p><strong>Correo:</strong> {usuario.correo}</p>
      </div>

      <div className="sensor-section">
        <h2>Asociar Sensor</h2>
        <p>Por ahora esta función estará disponible en el siguiente sprint.</p>
        <input type="text" placeholder="ID del sensor" disabled />
        <button disabled>Asociar Sensor</button>
      </div>
    </div>
  );
};

export default Perfil;