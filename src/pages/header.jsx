import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./pages/Header"; // 👈 con H mayúscula

function App() {
  return (
    <Router>
      {/* 👇 Encabezado visible en todas las páginas */}
      <Header />

      {/* 👇 Contenido principal con las rutas */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
