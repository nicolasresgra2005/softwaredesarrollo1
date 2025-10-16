
function Login() {
  return (
    <div className="auth-page">
      <h2>Iniciar sesión</h2>
      <form className="auth-form">
        <input type="email" placeholder="Correo electrónico" required />
        <input type="password" placeholder="Contraseña" required />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default Login;