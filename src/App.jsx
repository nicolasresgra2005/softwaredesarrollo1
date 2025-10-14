import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <header className="header">
        <h1 className="logo">AgroSense</h1>

        <nav className="nav">
          <Link to="/" className="nav-btn">Inicio</Link>
          <Link to="/login" className="nav-btn">Iniciar sesión</Link>
          <Link to="/register" className="nav-btn">Registro</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;