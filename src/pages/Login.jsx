
function Login() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-container">
          <div className="img-container" style={{height: "100%"}}>
            <img src="../src/assets/amigos.jpg" alt="" style={{height: "100%", width: "auto", transform: "scaleX(-1)"}} />
          </div>
          <div className="form-container">
            <div className="title">
              <h2>Iniciar sesión</h2>
              <div className="line"></div>
            </div>
            <form className="auth-form">
              <div className="input-container">
                <label htmlFor="">Correo electr&oacute;nico</label>
                <input type="email" className="login" placeholder="Ingresa tu Correo electrónico" required />
              </div>
              <div className="input-container">
                <label htmlFor="">Contraseña</label>
                <input type="password" className="login" placeholder="Ingresa tu Contraseña" required />
              </div>
              <button type="submit">¡Entrar ya!</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;