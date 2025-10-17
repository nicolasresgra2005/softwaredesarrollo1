import React from "react";
import "../pages/Register.css";


function Register() {
  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Registro de usuario</h2>
        <form>
          <label>Nombres</label>
          <input type="text" placeholder="Nombres" />

          <label>Apellidos</label>
          <input type="text" placeholder="Apellidos" />

          <label>Correo electrónico</label>
          <input type="email" placeholder="Correo electrónico" />

          <label>Contraseña</label>
          <input type="password" placeholder="Contraseña" />

          <button type="submit">¡Registrarse ya!</button>
        </form>
      </div>

      <div className="register-image">
        
      </div>
    </div>
  );
}

export default Register;
