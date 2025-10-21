import { useState } from "react";
import API from "../api";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    Correo_Electronico_U: "",
    Contraseña_U: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/login", formData);

      // 👇 Guardamos token y usuario en el almacenamiento local
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("usuario", JSON.stringify(res.data.user));

      // 👇 Redirige al perfil
      window.location.href = "/perfil";
    } catch (err) {
      setMessage(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>

        <label htmlFor="Correo_Electronico_U">Correo electrónico</label>
        <input
          type="email"
          id="Correo_Electronico_U"
          name="Correo_Electronico_U"
          placeholder="Ingrese su correo electrónico"
          value={formData.Correo_Electronico_U}
          onChange={handleChange}
          required
        />

        <label htmlFor="Contraseña_U">Contraseña</label>
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
      </form>
    </div>
  );
};

export default Login;

