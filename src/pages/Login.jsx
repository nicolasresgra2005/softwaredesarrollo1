import { useState, useEffect } from "react";
import API from "../api";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom"; // ✅ Importamos Link y useNavigate

const Login = () => {
  const [formData, setFormData] = useState({
    Correo_Electronico_U: "",
    Contraseña_U: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // ✅ Para redirigir después del login

  // ✅ Si ya hay sesión activa, saltarse el login
  useEffect(() => {
    if (localStorage.getItem("userLogged")) {
      navigate("/perfil");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/login", formData);

      // ✅ Guardamos token y usuario en el almacenamiento local
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.user));
      localStorage.setItem("userLogged", true); // 🔥 Marca de sesión activa

      // ✅ Redirige al perfil usando React Router
      navigate("/perfil");
    } catch (err) {
      setMessage(err.response?.data?.message || "Contraseña o correo incorrecto");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>

        <label htmlFor="Correo_Electronico_U"></label>
        <input
          type="email"
          id="Correo_Electronico_U"
          name="Correo_Electronico_U"
          placeholder="Ingrese su correo electrónico"
          value={formData.Correo_Electronico_U}
          onChange={handleChange}
          required
        />

        <label htmlFor="Contraseña_U"></label>
        <input
          type="password"
          id="Contraseña_U"
          name="Contraseña_U"
          placeholder="Ingrese su contraseña"
          value={formData.Contraseña_U}
          onChange={handleChange}
          required
        />

        <button type="submit">Ingresar</button>

        {message && <p>{message}</p>}

        {/* ✅ Enlace correcto a la recuperación */}
        <Link
          to="/forgot-password"
          className="text-sm text-blue-600 mt-3 hover:underline"
          style={{ display: "inline-block", marginTop: "10px" }}
        >
          ¿Has olvidado tu contraseña?
        </Link>
      </form>
    </div>
  );
};

export default Login;