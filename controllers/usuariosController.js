import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import { generarJWT, generarId } from "../helpers/tokens.js";
import { emailForgotPassword, emailRegistro } from "../helpers/emails.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    page: "Iniciar Sesión",
    csrfToken: req.csrfToken(),
  });
};

const authenticate = async (req, res) => {
  //Validación
  await check("email")
    .isEmail()
    .withMessage("Ingrese un email valido")
    .run(req);
  await check("password")
    .notEmpty()
    .withMessage("Ingrese su contraseña")
    .run(req);

  let result = validationResult(req);

  //Verificacion de errores
  if (!result.isEmpty()) {
    //Con errores
    return res.render("auth/login", {
      page: "Ingresar",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  //Comprobar si el usuario existe
  const {email, password} = req.body

  const user = await Usuario.findOne({where: {email}})

  if(!user){
    //Usuario no existente
    return res.render("auth/login", {
      page: "Ingresar",
      csrfToken: req.csrfToken(),
      errors: [{msg: 'El email ingresado no corresponde a un usuario activo'}]
    });
  }

  if(!user.confirmed){
    //Usuario existente pero con cuenta con verificada
    return res.render("auth/login", {
      page: "Ingresar",
      csrfToken: req.csrfToken(),
      errors: [{msg: 'Tu cuenta se encuentra pendiente de verificación'}]
    });
  }

  //Verificar password
  if(!user.verificarPassword(password)){
    //Contraseña no coincidente
    return res.render("auth/login", {
      page: "Ingresar",
      csrfToken: req.csrfToken(),
      errors: [{msg: 'El email o la contraseña ingresada es incorrecta'}]
    });
  }

  //Autenticar el usuario

  const token = generarJWT({id: user.id, name: user.name})

  //Almacenar JWT en una cookie

  return res.cookie('_token', token, {
    httpOnly: true,
    // secure: true,
    // sameSite: true
  }).redirect('/my-properties')
};

const logout = (req, res)=>{
  return res.clearCookie('_token').status(200).redirect('/auth/login')
}

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    page: "Crear cuenta",
    csrfToken: req.csrfToken(),
  });
};

const registrar = async (req, res) => {
  const { name, email, password } = req.body;

  //Validacion
  await check("name")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .run(req);
  await check("email")
    .isEmail()
    .withMessage("Ingrese un email valido")
    .run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .run(req);
  await check("repetir_password")
    .equals(password)
    .withMessage("Las contrañas deben ser iguales")
    .run(req);

  let result = validationResult(req);

  //Verificacion de errores
  if (!result.isEmpty()) {
    //Con errores
    return res.render("auth/registro", {
      page: "Crear cuenta",
      csrfToken: req.csrfToken(),
      errors: result.array(),
      user: {
        name: name,
        email: email,
      },
    });
  }

  //Verificacion de usuario duplicado
  const existingUser = await Usuario.findOne({ where: { email } });

  if (existingUser) {
    //Email ya utilizado
    return res.render("auth/registro", {
      page: "Crear cuenta",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "El email ingresado se encuentra actualmente en uso" }],
      user: {
        name: name,
      },
    });
  }

  const user = await Usuario.create({
    name,
    email,
    password,
    token: generarId(),
  });

  //Envia email de confirmacion
  emailRegistro({
    name: user.name,
    email: user.email,
    token: user.token,
  });

  //Mostrar mensaje de confirmacion
  res.render("templates/mensaje", {
    page: "Cuenta creada correctamente",
    message: `Hemos enviado un email de confirmacion a '${email}'. Verifique su cuenta para continuar`,
  });

  // const usuario = await Usuario.create(req.body);
  // res.json(usuario);
};

const confirmarRegistro = async (req, res) => {
  const { token } = req.params;

  //Verificar si el token corresponde a uno válido
  const user = await Usuario.findOne({ where: { token } });

  if (!user) {
    //Token no válido
    return res.render("auth/confirm-account", {
      page: "Error al confirmar tu cuenta",
      message: "Hubo un error al confirmar tu cuenta, intenta nuevamente",
      error: true,
    });
  }

  //Confirmar la cuenta
  user.token = null;
  user.confirmed = true;
  await user.save();

  res.render("auth/confirm-account", {
    page: "Cuenta verificada",
    message: "La cuenta se verificó correctamente",
  });
};

const formularioOlvideContraseña = (req, res) => {
  res.render("auth/forgot-password", {
    page: "Recupere su acceso a Bienes Raices",
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req, res) => {
  //Validacion
  await check("email")
    .isEmail()
    .withMessage("Ingrese un email valido")
    .run(req);

  let result = validationResult(req);

  //Verificacion de errores
  if (!result.isEmpty()) {
    //Con errores
    return res.render("auth/forgot-password", {
      page: "Recupere su acceso a Bienes Raices",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  const { email } = req.body;

  //Buscamos el usuario donde el email sea igual al email ingresado
  const user = await Usuario.findOne({ where: { email } });

  if (!user) {
    //Si no hay usuario coincidente
    return res.render("auth/forgot-password", {
      page: "Recupere su acceso a Bienes Raices",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "El email ingresado no pertenece a ningun usuario" }],
    });
  }

  //Generar token y enviar el email para restear password
  user.token = generarId();
  await user.save();

  //Enviar email
  emailForgotPassword({
    name: user.name,
    email,
    token: user.token,
  });

  //Render de mensaje al usuario para que revise el email
  res.render("templates/mensaje", {
    page: "Restablece tu contraseña",
    message: `Hemos enviado un email con las instrucciones para resetear la contraseña a '${email}'.`,
  });
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const user = await Usuario.findOne({ where: { token } });

  if (!user) {
    return res.render("auth/confirm-account", {
      page: "Restablece tu contraseña",
      message: "Hubo un error al validar tu información, intenta nuevamente",
      error: true,
    });
  }

  //Mostrar formulario para modificar la contraseña

  res.render("auth/reset-password", {
    page: "Restablece tu contraseña",
    csrfToken: req.csrfToken(),
  });
};

const nuevoPassword = async (req, res) => {
  //Validar password
  await check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .run(req);

  let result = validationResult(req);

  //Verificacion de errores
  if (!result.isEmpty()) {
    //Con errores
    return res.render("auth/reset-password", {
      page: "Restablece tu contraseña",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  //Identificar al usuario
  const { token } = req.params;
  const { password } = req.body;

  const user = await Usuario.findOne({ where: { token } });

  //Hashear password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);

  user.token = null;

  await user.save();

  res.render("auth/confirm-account", {
    page: "¡Has modificado tu contraseña correctamente!",
    message: "La nueva contraseña se guardo correctamente",
  });
};

export {
  formularioLogin,
  authenticate,
  logout,
  formularioRegistro,
  confirmarRegistro,
  formularioOlvideContraseña,
  registrar,
  resetPassword,
  comprobarToken,
  nuevoPassword,
};
