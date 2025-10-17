import React from "react";
import "./Login.css";

function Login() {
  return (
    <div className="login-page">
      <div className="login-left"></div> {/* Imagen o fondo a la izquierda */}
      <div className="login-container">
        <h2>Iniciar sesión</h2>
        <form className="login-form">
          <label>Correo electrónico</label>
          <input
            type="email"
            placeholder="Ingresa tu correo electrónico"
            required
          />

          <label>Contraseña</label>
          <input
            type="password"
            placeholder="Ingresa tu contraseña"
            required
          />

          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;