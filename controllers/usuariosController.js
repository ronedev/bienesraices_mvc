const formularioLogin = (req, res) => {
  res.render("auth/login", {
    page: 'Iniciar Sesión'
  });
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    page: 'Crear cuenta'
  });
};

const formularioOlvideContraseña = (req, res) => {
  res.render("auth/forgot-password", {
    page: 'Recupere su acceso a Bienes Raices'
  });
};

export { formularioLogin, formularioRegistro, formularioOlvideContraseña };
