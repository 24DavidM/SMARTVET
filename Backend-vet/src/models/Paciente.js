import mongoose, { Schema, model } from "mongoose";
import bcrpt from 'bcryptjs';
import Veterinario from "./Veterinario";

const pacienteSchema = new Schema({
    nombrePropietario: {
        type: String,
        required: true,
        trim: true
    },
    cedulaPropietario: {
        type: String,
        required: true,
        trim: true
    },
    emailPropietario: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    passwordPropietario: {
        type: String,
        required: true,
    },
    celularPropietario: {
        type: String,
        required: true,
        trim: true
    },
    nombreMascota: {
        type: String,
        required: true,
        trim: true
    },
    avatarMascota: {
        type: String,
        trim: true
    },
    avatarMascotaIA: {
        type: String,
        trim: true
    },
    tipoMascota: {
        type: String,
        required: true,
        trim: true
    },
    fechaNacimientoMascota: {
        type: Date,
        required: true,
        trim: true
    },
    SintomasMascota: {
        type: String,
        required: true,
        trim: true
    },
    fechaIngresoMascota: {
        type: Date,
        required: true,
        trim: true,
        default: Date.now
    },
    salidaMascota: {
        type: Date,
        required: true,
        trim: true,
        default: null
    },
    estadoMascota: {
        type: Boolean,
        default: true
    },
    rol: {
        type: String,
        default: "paciente"
    },
    veterinario:{
        type:mongoose.Schema.Types.ObjectId,ref:'Veterinario'
    }

},{
    timestamps:true 
})

//metodo para cifrar el password del dueño del paciente
pacienteSchema.methods.encrypPassword = async function(password){
    const salt = await bcrpt.genSalt(10) //variable para generar saltos
    return bcrpt.hash(password,salt)
}

//metodo para comprobar si el password es el mismo que en bd
pacienteSchema.methods.matchPassword = function (password) {
    return bcrpt.compareSync(password, this.passwordPropietario)
}
export default model('Paciente', pacienteSchema);
