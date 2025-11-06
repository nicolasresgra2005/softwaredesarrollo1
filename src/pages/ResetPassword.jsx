import { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const query = new URLSearchParams(useLocation().search);
  const token = query.get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5173/api/users/reset-password", {
        token,
        nuevaContraseña: password,
      });
      setMsg("Tu contraseña ha sido cambiada con éxito ");
    } catch (error) {
      setMsg("Error al restablecer la contraseña");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Nueva Contraseña</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          className="border p-2 w-full mb-4 rounded"
          placeholder="Escribe tu nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded w-full"
        >
          Restablecer
        </button>
      </form>
      {msg && <p className="mt-4 text-center">{msg}</p>}
    </div>
  );
}
