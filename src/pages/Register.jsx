import { useState } from "react";
import API from "../api";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    Nombre_U: "",
    Apellido_U: "",
    Correo_Electronico_U: "",
    Contraseña_U: "",
    ConfirmarContraseña: "",
  });

  const [message, setMessage] = useState("");

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (formData.Contraseña_U !== formData.ConfirmarContraseña) {
      setMessage("Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await API.post("/register", {
        Nombre_U: formData.Nombre_U,
        Apellido_U: formData.Apellido_U,
        Correo_Electronico_U: formData.Correo_Electronico_U,
        Contraseña_U: formData.Contraseña_U,
      });
      setMessage(res.data.message || "Registro exitoso ✅");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error al registrar usuario ❌");
    }
  };

  return (
    <div className="register-container">
      <form className="register-box" onSubmit={handleSubmit}>
        <h2>Registro de Usuario</h2>

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

        <label htmlFor="Apellido_U">Apellido</label>
        <input
          type="text"
          id="Apellido_U"
          name="Apellido_U"
          placeholder="Ingrese su apellido"
          value={formData.Apellido_U}
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

        <label htmlFor="ConfirmarContraseña">Confirmar contraseña</label>
        <input
          type="password"
          id="ConfirmarContraseña"
          name="ConfirmarContraseña"
          placeholder="Repita su contraseña"
          value={formData.ConfirmarContraseña}
          onChange={handleChange}
          required
        />

        <button type="submit">Registrar</button>

        {message && <p className="message">{message}</p>}
      </form>
    </div>
  );
};

export default Register;
