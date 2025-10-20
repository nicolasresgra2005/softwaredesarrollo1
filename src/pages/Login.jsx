import { useState } from "react";
import API from "../api";

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
      setMessage(res.data.message);
      localStorage.setItem("token", res.data.token); // Guarda el token JWT
    } catch (err) {
      setMessage(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>

        <input
          type="email"
          name="Correo_Electronico_U"
          placeholder="Correo electrónico"
          value={formData.Correo_Electronico_U}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="Contraseña_U"
          placeholder="Contraseña"
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
