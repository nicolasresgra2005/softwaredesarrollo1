import React from "react";
import "./Login.css";

function Login() {
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        <form>
          <input type="text" placeholder="Usuario" />
          <input type="password" placeholder="Contraseña" />
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default Login;