import React from "react"; 
import "../pages/Register.css";

function Register() {
  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Registro de usuario</h2>
        <form>
          <label>Nombres</label>
          <input type="text" placeholder="  Primer Nombre" />

          <label>Apellidos</label>
          <input type="text" placeholder="Primer Apellido" />

          <label>Correo electrónico</label>
          <input type="email" placeholder="Correo electrónico" />

          <label>Contraseña</label>
          <input type="password" placeholder="Contraseña" />

          <button type="submit">¡Registrarse ya!</button>
        </form>
      </div>
    </div>
  );
}

export default Register;