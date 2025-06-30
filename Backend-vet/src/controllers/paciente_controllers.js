import { sendMailToOwner } from "../config/nodemailer.js";
import Paciente from "../models/Paciente.js";

import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs-extra'

const registroPaciente = async (req, res) => {

    //Obtener datos
    const { emailPropietario } = req.body

    //Validaciones
    if (Object.values(req.body).includes("")) { return res.status(400).json({ msg: "Lo sentimos, todos los campos son obligatorios" })}

    const verificarEmailBDD = await Paciente.findOne({ emailPropietario });

    if (verificarEmailBDD) {return res.status(400).json({ msg: "Lo siento, el email ya se encuentra registrado" })}

    //Crear contraseña para el paciente
    const password = Math.random().toString(36).toUpperCase().slice(2,5) 
    const nuevoPaciente = new Paciente({
        ...req.body,
        passwordPropietario: await Paciente.prototype.encrypPassword(password),
        veterinario:req.veterinarioBDD?._id
    })

    if (req.files?.imagen){
        const {secure_url,public_id}= await cloudinary.uploader.upload(req.files.imagen.tempFilePath,{folder:'Pacientes'})
        nuevoPaciente.avatarMascota = secure_url
        nuevoPaciente.avatarMascotaID = public_id
        await fs.unlink(req.files.imagen.tempFilePath)
    }
    if(req.files?.avatarmascotaIA){

    }
    await nuevoPaciente.save()
    await sendMailToOwner(emailPropietario,"VET"+password)
    res.status(201).json({msg:"Registro exitoso de la mascota y correo enviado al propietario"})

}

export {
    registroPaciente
}