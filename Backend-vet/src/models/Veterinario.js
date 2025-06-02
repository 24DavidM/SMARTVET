<<<<<<< HEAD
import {Schema, model} from 'mongoose';

import bcrpt from 'bcryptjs';

const veterinarioSchema = new Schema({
    nombre: {
        type:String,
        required:true,
        trim:true //QUITA LOS ESPACIOS 
    },
     apellido: {
        type:String,
        required:true,
        trim:true //QUITA LOS ESPACIOS 
    },
     direccion: {
        type:String,
        default:null,
        trim:true //QUITA LOS ESPACIOS 
    },
     celular: {
        type:String,
        default: null,
        trim:true //QUITA LOS ESPACIOS 
    },
     email: {
        type:String,
        required:true,
        trim:true,
        unique: true  
    },
     password: {
        type:String,
        required:true,
    },
     status: {
        type:Boolean,
        default: true
    },
     token: {
        type:String,
        default : null
    },
     confirmEmail: {
        type:Boolean,
        default:false
    },
     rol: {
        type:String,
        default:'Veterinario' 
    }
},{
    timestamps:true
})

//metodo para cifrar el password del veterinario
veterinarioSchema.methods.encrypPassword = async function(password){
    const salt = await bcrpt.genSalt(10) //variable para generar saltos
    const passwordEncryp = await bcrpt.hash(password,salt)
    return passwordEncryp
}

//metodo para comprobar si el password es el mismo que en bd
veterinarioSchema.methods.matchPassword = async function (password) {
    const response = await bcrpt.compareSync(password, this.password)
    return response
}

//metodo para crear un token
veterinarioSchema.methods.createToken = async function () {
    const tokenGenerado = this.token = Math.random().toString(36).slice(2)
    return tokenGenerado
}

export default model('Veterinario', veterinarioSchema)
=======
import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";

const veterinarioSchema = new Schema(
  {
    nombre: {
      type: String,
      require: true,
      trim: true,
    },
    apellido: {
      type: String,
      require: true,
      trim: true,
    },
    direccion: {
      type: String,
      default: null,
      trim: true,
    },
    celular: {
      type: String,
      default: null,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      require: trusted,
    },
    status: {
      type: Boolean,
      default: true,
    },
    token: {
      type: String,
      default: null,
    },
    confirmEmail: {
      type: Boolean,
      default: false,
    },
    rol: {
      type: String,
      default: "Veterinario",
    },
  },
  {
    timestamps: true,
  }
);
export default model("Veterinario", veterinarioSchema);
>>>>>>> 2862713f6ac7690cfcea713c03d1d7aaf8ad86fe
