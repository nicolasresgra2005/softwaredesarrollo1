import { useState } from "react";
import API from "../api";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    Nombre_U: "",
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
      const res = await API.post("/register", formData);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error al registrar usuario");
    }
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Registro</h2>

        <label htmlFor="Nombre_U">Nombre</label>
        <input
          type="text"
          id="Nombre_U"
          name="Nombre_U"
          placeholder="Ingrese su nombre"
          value={formData.Nombre_U}
          onChange={handleChange}
          required
        />

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
          placeholder="Cree una contraseña"
          value={formData.Contraseña_U}
          onChange={handleChange}
          required
        />

        <button type="submit">Registrar</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Register;

