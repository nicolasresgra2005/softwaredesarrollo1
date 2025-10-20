import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./pages/header"; //importación del header
import Perfl from "./pages/Perfil";

function App() {
  return (
    <Router>
      {/*Encabezado*/}
      <Header />

      {/* Contenido rutas */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
           <Route path="/perfil" element={<Register />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;