import { sendMailToOwner } from "../config/nodemailer.js";
import Paciente from "../models/Paciente.js";

import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs-extra'

const registroPaciente = async (req, res) => {

    //Obtener datos
    const { emailPropietario } = req.body

    //Validaciones
    if (Object.values(req.body).includes("")) { return res.status(400).json({ msg: "Lo sentimos, todos los campos son obligatorios" }) }

    const verificarEmailBDD = await Paciente.findOne({ emailPropietario });

    if (verificarEmailBDD) { return res.status(400).json({ msg: "Lo siento, el email ya se encuentra registrado" }) }

    //Crear contraseña para el paciente
    const password = Math.random().toString(36).toUpperCase().slice(2, 5)
    const nuevoPaciente = new Paciente({
        ...req.body,
        passwordPropietario: await Paciente.prototype.encrypPassword(password),
        veterinario: req.veterinarioBDD?._id
    })

    if (req.files?.imagen) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.imagen.tempFilePath, { folder: 'Pacientes' })
        nuevoPaciente.avatarMascota = secure_url
        nuevoPaciente.avatarMascotaID = public_id
        await fs.unlink(req.files.imagen.tempFilePath)
    }
    if (req.body?.avatarMascotaIA) {
        // data:image/png;base64,iVBORw0KGgjbjgfyvh
        // iVBORw0KGgjbjgfyvh
        const base64Data = req.body.avatarMascotaIA.replace(/^data:image\/\w+;base64,/, '')
        // iVBORw0KGgjbjgfyvh  -  010101010101010101
        const buffer = Buffer.from(base64Data, 'base64')
        const { secure_url } = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: 'Pacientes', resource_type: 'auto' }, (error, response) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(response)
                }
            })
            stream.end(buffer)
        })
        nuevoPaciente.avatarMascotaIA = secure_url
    }

    await nuevoPaciente.save()
    await sendMailToOwner(emailPropietario, "VET" + password)
    res.status(201).json({ msg: "Registro exitoso de la mascota y correo enviado al propietario" })

}

const listarPaciente = async (req, res) =>{
    const paciente = await Paciente.find({estadoMascota:true}).where('veterinario').equals(req.veterinarioBDD).select('-createdAt -updatedAt -__v').populate('veterinario','_id nombre apellido')
    res.status(200).json(paciente)
}
export {
    registroPaciente,
    listarPaciente
}