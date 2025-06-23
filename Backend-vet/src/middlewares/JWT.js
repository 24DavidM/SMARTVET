import jwt from 'jsonwebtoken'
import Veterinario from '../models/Veterinario.js'

const createTokeJWT = (id, rol) => {
    return jwt.sign({id, rol},process.env.JWT_SECRET,{expiresIn:"1d"})


}

const verifyTokenJWT = async (req, res, next) => {
    const {authorization} = req.headers
    if (!authorization) return res.status(401).json({msg:"Token no proporcionado"});
    try{
        const token = authorization.split(' ')[1]

        const {id,rol} = jwt.verify(token,process.env.JWT_SECRET)

        if (rol === "Veterinario"){
            req.veterinarioBDD = await Veterinario.findById(id).lean().select("-password")
            next()

        }
    }catch(error){
        return res.status(401).json({msg:"Token no válido o expirado"})
    }
}
export{
    createTokeJWT,
    verifyTokenJWT
}
