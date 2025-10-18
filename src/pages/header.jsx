import React from "react";
import "./header.css";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <div className="logo-container">
        <div className="logo-image"></div>
        <h1 className="logo-text">Agro-Sense</h1>
      </div>

      <nav className="nav">
        <Link to="/" className="nav-btn">Inicio</Link>
        <Link to="/login" className="nav-btn">Iniciar sesión</Link>
        <Link to="/register" className="nav-btn">Registro</Link>
      </nav>
    </header>
  );
}

export default Header;