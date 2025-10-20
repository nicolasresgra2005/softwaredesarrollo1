import { useState } from "react";
import API from "../api";

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

        <input
          type="text"
          name="Primer_Nombre_U"
          placeholder="Nombre"
          value={formData.Primer_Nombre_U}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="Primer_Apellido_U"
          placeholder="Apellido"
          value={formData.Primer_Apellido_U}
          onChange={handleChange}
          required
        />
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

        <button type="submit">Registrarse</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Register;
