import { useState } from "react";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5173/api/users/solicitar-reset", {
        Correo_Electronico_U: email,
      });
      setMsg("Correo de recuperación enviado. Revisa tu bandeja.");
    } catch (Error) {
      setMsg("Error al enviar el correo. Intenta nuevamente.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Recuperar Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          className="border p-2 w-full mb-4 rounded"
          placeholder="Tu correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 rounded w-full"
        >
          Enviar enlace
        </button>
      </form>
      {msg && <p className="mt-4 text-center">{msg}</p>}
    </div>
  );
}
