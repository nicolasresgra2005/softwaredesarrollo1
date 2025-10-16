import React from "react";
import "./Home.css";
function Home() {
  return (
    <div className="info-section">
      <h2>Bienvenido a <span className="highlight">AgroSense</span></h2>
      <p>
        Una plataforma inteligente que conecta tecnología y agricultura para optimizar tus recursos,
        monitorear tus cultivos y mejorar la producción de manera sostenible.
      </p>
    </div>
  );
}

export default Home;