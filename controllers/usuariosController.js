import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import { generarId } from "../helpers/tokens.js";
import { emailRegistro } from "../helpers/emails.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    page: "Iniciar Sesión",
  });
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    page: "Crear cuenta",
  });
};

const registrar = async (req, res) => {

  const {name, email, password} = req.body

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
  await check("repetir_password").equals(password)
    .withMessage("Las contrañas deben ser iguales")
    .run(req);

  let result = validationResult(req);

  //Verificacion de errores
  if (!result.isEmpty()) {
    //Con errores
    return res.render("auth/registro", {
      page: "Crear cuenta",
      errors: result.array(),
      user: {
        name: name,
        email: email
      }
    });
  }

  //Verificacion de usuario duplicado
  const existingUser = await Usuario.findOne({where: {email}})

  if(existingUser){
    //Email ya utilizado
    return res.render("auth/registro", {
      page: "Crear cuenta",
      errors: [{msg: 'El email ingresado se encuentra actualmente en uso'}],
      user: {
        name: name,
      }
    });
  }

  const user = await Usuario.create({
    name,
    email,
    password,
    token: generarId()
  })

  //Envia email de confirmacion
  emailRegistro({
    name: user.name,
    email: user.email,
    token: user.token
  })

  //Mostrar mensaje de confirmacion
  res.render('templates/mensaje',{
    page: 'Cuenta creada correctamente',
    message: `Hemos enviado un email de confirmacion a '${email}'. Verifique su cuenta para continuar`
  })


  // const usuario = await Usuario.create(req.body);
  // res.json(usuario);
};

const formularioOlvideContraseña = (req, res) => {
  res.render("auth/forgot-password", {
    page: "Recupere su acceso a Bienes Raices",
  });
};

export {
  formularioLogin,
  formularioRegistro,
  formularioOlvideContraseña,
  registrar,
};
