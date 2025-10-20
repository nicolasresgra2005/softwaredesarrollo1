import { useState } from "react";
import API from "../api";
import "../pages/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    Primer_Nombre_U: "",
    Primer_Apellido_U: "",
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
    <div className="register-container">
      <form className="register-box" onSubmit={handleSubmit}>
        <h2>Registro</h2>

        <label htmlFor="Primer_Nombre_U">Primer Nombre</label>
        <input
          type="text"
          id="Primer_Nombre_U"
          name="Primer_Nombre_U"
          placeholder="Ingrese su nombre"
          value={formData.Primer_Nombre_U}
          onChange={handleChange}
          required
        />

        <label htmlFor="Primer_Apellido_U">Primer Apellido</label>
        <input
          type="text"
          id="Primer_Apellido_U"
          name="Primer_Apellido_U"
          placeholder="Ingrese su apellido"
          value={formData.Primer_Apellido_U}
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
          placeholder="Ingrese su contraseña"
          value={formData.Contraseña_U}
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