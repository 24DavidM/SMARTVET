import {Router} from 'express'
import { registroPaciente } from '../controllers/paciente_controllers.js'
import { verifyTokenJWT } from '../middlewares/JWT.js'

const router = Router()


router.post('/paciente/registro',verifyTokenJWT,registroPaciente)

export default router