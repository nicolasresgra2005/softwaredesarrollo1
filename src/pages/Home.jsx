import React from "react";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">   {/* 👈 Debe llamarse igual */}
      <div className="info-section">
        <h2>
         <h2 class="titulo">Bienvenido a Agro-Sense</h2>
        </h2>
        <p>
          Una plataforma inteligente que combina tecnología agrícola y 
          monitoreo ambiental para medir la humedad y temperatura del suelo, ayudando a optimizar el riego y mejorar el rendimiento de los cultivos de forma sostenible.
        </p>
      </div>
    </div>
  );
}

export default Home;