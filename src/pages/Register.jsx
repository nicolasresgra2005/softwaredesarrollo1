
function Register() {
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-container">
          <div className="img-container" style={{height: "100%"}}>
            <img src="../src/assets/mujer.jpg" alt="" style={{height: "100%", width: "auto"}} />
          </div>
          <div className="form-container">
            <div className="title">
              <h2>Registro de usuario</h2>
              <div className="line"></div>
            </div>
            <form className="auth-form">
              <div className="input-container">
                <label htmlFor="">Nombre</label>
                <input type="text" className="login" placeholder="Nombre completo" required />
              </div>
              <div className="input-container">
                <label htmlFor="">Correo electr&oacute;nico</label>
                <input type="email" className="login" placeholder="Correo electrónico" required />
              </div>
              <div className="input-container">
                <label htmlFor="">Contraseña</label>
                <input type="password" className="login" placeholder="Contraseña" required />
              </div>
              <button type="submit">¡Registrarse ya!</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;