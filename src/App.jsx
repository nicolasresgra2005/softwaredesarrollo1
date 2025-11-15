import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Header from "./pages/header"; 
import Perfil from "./pages/Perfil";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function AppContent() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    document.body.classList.remove("home", "login", "register");

    if (path === "/") document.body.classList.add("home");
    else if (path === "/login") document.body.classList.add("login");
    else if (path === "/register") document.body.classList.add("register");
  }, [location]);

  return (
    <>
      {/* Header visible siempre */}
      <Header />

      {/* Contenido principal */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/Perfil" element={<Perfil />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;