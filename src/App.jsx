import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./pages/header"; 
import Perfil from "./pages/Perfil";

function App() {
  return (
    <Router>
      {/* Header visible siempre */}
      <Header />

      {/* Contenido principal */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Perfil" element={<Perfil />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;