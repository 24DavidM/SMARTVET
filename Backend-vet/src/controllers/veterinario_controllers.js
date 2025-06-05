import { sendMailToRecoveryPassword, sendMailToRegister } from "../config/nodemailer.js";
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
  const token =  await nuevoVeterinario.createToken();
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

  const token = await  veterinarioBDD.createToken(); 
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

  const veterinarioBDD = await Veterinario.findOne({token:req.params.token })

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

export {
  registro,
  confirmarMail,
  recuperarPassword,
  comprobarTokenPassword,
  crearNuevoPassword,
};
