
function Register() {
  return (
    <div className="auth-page">
      <h2>Registro de usuario</h2>
      <form className="auth-form">
        <input type="text" placeholder="Nombre completo" required />
        <input type="email" placeholder="Correo electrónico" required />
        <input type="password" placeholder="Contraseña" required />
        <button type="submit">Registrar</button>
      </form>
    </div>
  );
}

export default Register;