import mongoose from "mongoose";
import { sendMailToRecoveryPassword, sendMailToRegister } from "../config/nodemailer.js";
import { createTokeJWT } from "../middlewares/JWT.js";
import Veterinario from "../models/Veterinario.js";

const registro = async (req, res) => {
  const { email, password } = req.body;

  if (Object.values(req.body).includes("")) {
    return res
      .status(400)
      .json({ msg: "Lo sentimos, todos los campos son obligatorios" });
  }

  const verificarEmailBDD = await Veterinario.findOne({ email });

  if (verificarEmailBDD) {
    return res
      .status(400)
      .json({ msg: "Lo siento, el email ya se encuentra registrado" });
  }

  const nuevoVeterinario = new Veterinario(req.body);
  nuevoVeterinario.password = await nuevoVeterinario.encrypPassword(password);
  const token = await nuevoVeterinario.createToken();
  sendMailToRegister(email, token);
  await nuevoVeterinario.save();

  res
    .status(200)
    .json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" });
};

const confirmarMail = async (req, res) => {
  res.send("Cuenta verificada");
  const { token } = req.params;
  const veterinarioBDD = await Veterinario.findOne({ token });

  veterinarioBDD.token = null;
  veterinarioBDD.confirmEmail = true;

  await veterinarioBDD.save();

  res.status(200).json({ msg: "Cuenta confirmada correctamente" });
};

// etapas para recuperar contraseña
const recuperarPassword = async (req, res) => {
  const { email } = req.body;

  if (Object.values(req.body).includes("")) {
    return res
      .status(404)
      .json({ msg: "Lo sentimos, debes llenar todos los campos" });
  }

  const veterinarioBDD = await Veterinario.findOne({ email });
  if (!veterinarioBDD) {
    return res
      .status(404)
      .json({ msg: "El usuario no se encuentra registrado" });
  }

  const token = await veterinarioBDD.createToken();
  veterinarioBDD.token = token;

  // Enviar correo
  await sendMailToRecoveryPassword(email, token);
  await veterinarioBDD.save();

  res
    .status(200)
    .json({ msg: "Revisa tu correo para restablecer la contraseña" });
};


// etapas para recuperar contraseña
const comprobarTokenPassword = async (req, res) => {
  const { token } = req.params;
  const veterinarioBDD = Veterinario.findOne({ token });

  if (veterinarioBDD.token !== token)
    return res
      .status(404)
      .json({ msg: "Lo sentimos, no se puede validar la cuenta" })
  await veterinarioBDD.save()
  res
    .status(200)
    .json({ msg: "Ya puedes cambiar la contraseña" });
};

// etapas para recuperar contraseña
const crearNuevoPassword = async (req, res) => {
  const { password, confirmPassword } = req.body;
  if (Object.values(req.body).includes(""))
    return res
  
      .status(404)
      .json({ msg: "Lo sentimos debes llenar todo los datos" })

  if (password !== confirmPassword)
    return res
      .status(404)
      .json({ msg: "Lo sentimos los password no coinciden" })

  const veterinarioBDD = await Veterinario.findOne({ token: req.params.token })

  if (veterinarioBDD.token !== req.params.token)
    return res
      .status(404)
      .json({ msg: "Lo sentimos la cuenta no se puede validar" })

  veterinarioBDD.token = null;
  veterinarioBDD.password = await veterinarioBDD.encrypPassword(password)
  await veterinarioBDD.save()
  res
    .status(404)
    .json({
      msg: "Contraseña cambiada correctamente puedes iniciar correctamente",
    });
};

const login = async (req, res) => {
  const { email, password } = req.body

  if (Object.values(req.body).includes("")) return res.status(400).json({ msg: "Lo sentimos debes llenar todo los campos" });

  const veterinarioBDD = await Veterinario.findOne({ email }).select("-status -__v -updatedAt -createdAt")

  if (veterinarioBDD?.confirmEmail === false) return res.status(403).json({ msg: "Lo setimos debes confirmar tu cuenta antes de iniciar sesión" })

  if (!veterinarioBDD) return res.status(404).json({ msg: "Lo sentimos el usuario no se encuentra registrado" });

  const verificarPassword = await veterinarioBDD.matchPassword(password)
  if (!verificarPassword) return res.status(401).json({ msg: "Lo sentimos el password es incorrecto" })

  const { nombre, apellido, direccion, telefono, _id, rol } = veterinarioBDD

  const token = createTokeJWT(veterinarioBDD._id, veterinarioBDD.rol)

  res.status(200).json({
    token,
    rol,
    nombre,
    apellido,
    direccion,
    telefono,
    _id
  })
}

const perfil = async (req, res) => {
  const { token, confirmEmail, createdAt, updatedAt, __v, ...datosPerfil } = req.veterinarioBDD
  res.status(200).json(datosPerfil)
}

const actualizarperfil = async (req, res) => {
  const {id} = req.params
  const { nombre, apellido, direccion, celular, email } = req.body

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ msg: "Lo sentimos id no valida" })
  if (Object.values(req.body).includes("")) return res.status(404).json({ msg: "Lo sentimos deben llenarse todo los campos" })

  const veterinarioBDD = await Veterinario.findById(id)
  if (!veterinarioBDD) return res.status(404).json({ msg: `Lo sentimos, no existe el veterinario ${id}` })
  if (veterinarioBDD.email != email) {
    const veterinarioBDDMail = await Veterinario.findOne({ email })
    if (veterinarioBDDMail) {
      return res.status(404).json({ msg: `Lo sentimos, el email existe ya se encuentra registrado` })
    }
  }
  veterinarioBDD.nombre = nombre ?? veterinarioBDD.nombre
  veterinarioBDD.apellido = apellido ?? veterinarioBDD.apellido
  veterinarioBDD.direccion = direccion ?? veterinarioBDD.direccion
  veterinarioBDD.celular = celular ?? veterinarioBDD.celular
  veterinarioBDD.email = email ?? veterinarioBDD.email
  await veterinarioBDD.save()
  console.log(veterinarioBDD)
  res.status(200).json(veterinarioBDD)
}
const actualizarPassword = async (req,res)=>{
    const veterinarioBDD = await Veterinario.findById(req.veterinarioBDD._id)
    if(!veterinarioBDD) return res.status(404).json({msg:`Lo sentimos, no existe el veterinario ${id}`})
    const verificarPassword = await veterinarioBDD.matchPassword(req.body.passwordactual)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password actual no es el correcto"})
    veterinarioBDD.password = await veterinarioBDD.encrypPassword(req.body.passwordnuevo)
    await veterinarioBDD.save()
    res.status(200).json({msg:"Password actualizado correctamente"})
}

export {
  registro,
  confirmarMail,
  recuperarPassword,
  comprobarTokenPassword,
  crearNuevoPassword,
  login,
  perfil,
  actualizarperfil,
  actualizarPassword
};
