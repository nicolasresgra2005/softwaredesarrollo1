import { useState } from "react";
import API from "../api";
import "../pages/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    Primer_Nombre_U: "",
    Primer_Apellido_U: "",
    Correo_Electronico_U: "",
    Contraseña_U: "",
    Confirmar_Contraseña: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.Contraseña_U !== formData.Confirmar_Contraseña) {
      setMessage("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await API.post("/register", formData);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error al registrar usuario");
    }
  };

  return (
    <div className="register-container">
      <form className="register-box" onSubmit={handleSubmit}>
        <h2>Registro</h2>

        <label>Primer Nombre</label>
        <input
          type="text"
          name="Primer_Nombre_U"
          placeholder="Nombre"
          value={formData.Primer_Nombre_U}
          onChange={handleChange}
          required
        />

        <label>Primer Apellido</label>
        <input
          type="text"
          name="Primer_Apellido_U"
          placeholder="Apellido"
          value={formData.Primer_Apellido_U}
          onChange={handleChange}
          required
        />

        <label>Correo electrónico</label>
        <input
          type="email"
          name="Correo_Electronico_U"
          placeholder="Correo electrónico"
          value={formData.Correo_Electronico_U}
          onChange={handleChange}
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          name="Contraseña_U"
          placeholder="Contraseña"
          value={formData.Contraseña_U}
          onChange={handleChange}
          required
        />

        <label>Confirmar contraseña</label>
        <input
          type="password"
          name="Confirmar_Contraseña"
          placeholder="Confirmar contraseña"
          value={formData.Confirmar_Contraseña}
          onChange={handleChange}
          required
        />

        <button type="submit">Registrarse</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Register;
