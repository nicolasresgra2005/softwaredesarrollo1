import React from "react";
import "./header.css";
import { Link, useLocation } from "react-router-dom";

function Header() {
  const isLogged = localStorage.getItem("userLogged");
  const location = useLocation();  // 🔥 Para detectar dónde estamos

  return (
    <header className="header">
      
      <div className="logo-container">
        <div className="logo-image"></div>
        <h1 className="logo-text">Agro-Sense</h1>
      </div>

      <nav className="nav">
        <Link to="/" className="nav-btn">
          Inicio
        </Link>

        {!isLogged && (
          <>
            {location.pathname !== "/login" && (
              <Link to="/login" className="nav-btn">
                Iniciar sesión
              </Link>
            )}

            {location.pathname !== "/register" && (
              <Link to="/register" className="nav-btn">
                Registro
              </Link>
            )}
          </>
        )}

        {isLogged && (
          <>
            {location.pathname !== "/perfil" && (
              <Link to="/perfil" className="nav-btn">
                Perfil
              </Link>
            )}

            <Link
              to="/"
              className="nav-btn"
              onClick={() => localStorage.removeItem("userLogged")}
            >
              Cerrar sesión
            </Link>
          </>
        )}

      </nav>
    </header>
  );
}

export default Header;