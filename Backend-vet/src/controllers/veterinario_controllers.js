import sendMailToRegister, {
  sendMailToRecoveryPassword,
} from "../config/nodemailer.js";
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

  const token = nuevoVeterinario.createToken();

  await sendMailToRegister(email, token);

  await nuevoVeterinario.save();

  res
    .status(200)
    .json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" });
};

const confirmarMail = async (req, res) => {
  resp.send("Cuenta verificada");
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
  if (Object.values(req.body).includes(""))
    return res
      .status(404)
      .json({ msg: "Lo sentimos deber llenar todos los capos" });

  const veterinarioBDD = await Veterinario.findOne({ email });
  if (!veterinarioBDD)
    return res
      .status(404)
      .json({ msg: "El usuario no se encuentra registrado" });

  const token = VeterinarioBDD.createToken();
  veterinarioBDD.token = token;

  //Correo

  await sendMailToRecoveryPassword(email, token);
  await veterinarioBDD.save();

  res
    .status(200)
    .josn({ msg: "Revisa tu correo para restablecer la contraseña" });
};

// etapas para recuperar contraseña
const comprobarTokenPassword = (req, res) => {
  res.send("Eapa 2: Token confirmado");
};
// etapas para recuperar contraseña
const crearNuevoPassword = (req, res) => {
  res.send("Eapa 3: Contraseña cambiada");
};

export {
  registro,
  confirmarMail,
  recuperarPassword,
  comprobarTokenPassword,
  crearNuevoPassword,
};
