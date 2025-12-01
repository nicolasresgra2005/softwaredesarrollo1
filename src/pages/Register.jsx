import { useState } from "react";
import API from "../api";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    Primer_Nombre_U: "",
    Primer_Apellido_U: "",
    Correo_Electronico_U: "",
    Contraseña_U: "",
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);

  const validateFields = () => {
    let tempErrors = {};

    // 2. Campos obligatorios
    if (!formData.Primer_Nombre_U.trim())
      tempErrors.Primer_Nombre_U = "El nombre es obligatorio";
    else if (formData.Primer_Nombre_U.length < 2)
      tempErrors.Primer_Nombre_U = "Debe tener al menos 2 caracteres";

    if (!formData.Primer_Apellido_U.trim())
      tempErrors.Primer_Apellido_U = "El apellido es obligatorio";
    else if (formData.Primer_Apellido_U.length < 2)
      tempErrors.Primer_Apellido_U = "Debe tener al menos 2 caracteres";

    if (!formData.Correo_Electronico_U.trim())
      tempErrors.Correo_Electronico_U = "El correo es obligatorio";
    else {
      const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexCorreo.test(formData.Correo_Electronico_U))
        tempErrors.Correo_Electronico_U = "El formato del correo no es válido";
    }

    // 🔥 Nueva validación de contraseña:
    if (!formData.Contraseña_U.trim())
      tempErrors.Contraseña_U = "La contraseña es obligatoria";
    else {
      const passwordRegex = /^(?=.*[0-9])(?=.*[\W_]).{8,}$/;
      if (!passwordRegex.test(formData.Contraseña_U))
        tempErrors.Contraseña_U =
          "Debe tener mínimo 8 caracteres, 1 número y 1 símbolo.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });

    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!validateFields()) {
      setMessage("⚠️ Corrige los campos marcados en rojo");
      return;
    }

    try {
      setSending(true);
      const res = await API.post("/register", formData);
      setMessage("✅ Usuario registrado con éxito");
      alert("Usuario registrado con éxito");
      window.location.href = "/login";
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Error al registrar usuario");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="register-container">
      <form className="register-box" onSubmit={handleSubmit}>
        <h2>Registro de Usuario</h2>

        <input
          type="text"
          id="Primer_Nombre_U"
          name="Primer_Nombre_U"
          placeholder="Ingrese su nombre"
          value={formData.Primer_Nombre_U}
          onChange={handleChange}
          className={errors.Primer_Nombre_U ? "input-error" : ""}
        />
        {errors.Primer_Nombre_U && (
          <span className="error-msg">{errors.Primer_Nombre_U}</span>
        )}

        <input
          type="text"
          id="Primer_Apellido_U"
          name="Primer_Apellido_U"
          placeholder="Ingrese su apellido"
          value={formData.Primer_Apellido_U}
          onChange={handleChange}
          className={errors.Primer_Apellido_U ? "input-error" : ""}
        />
        {errors.Primer_Apellido_U && (
          <span className="error-msg">{errors.Primer_Apellido_U}</span>
        )}

        <input
          type="email"
          id="Correo_Electronico_U"
          name="Correo_Electronico_U"
          placeholder="Ingrese su correo electrónico"
          value={formData.Correo_Electronico_U}
          onChange={handleChange}
          className={errors.Correo_Electronico_U ? "input-error" : ""}
        />
        {errors.Correo_Electronico_U && (
          <span className="error-msg">{errors.Correo_Electronico_U}</span>
        )}

        <input
          type="password"
          id="Contraseña_U"
          name="Contraseña_U"
          placeholder="Ingrese su contraseña"
          value={formData.Contraseña_U}
          onChange={handleChange}
          className={errors.Contraseña_U ? "input-error" : ""}
        />
        {errors.Contraseña_U && (
          <span className="error-msg">{errors.Contraseña_U}</span>
        )}

        <button type="submit" disabled={sending}>
          {sending ? "Enviando..." : "Registrar"}
        </button>

        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Register;