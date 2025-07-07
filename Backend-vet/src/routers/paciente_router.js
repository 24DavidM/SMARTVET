import {Router} from 'express'
import { listarPaciente, registroPaciente } from '../controllers/paciente_controllers.js'
import { verifyTokenJWT } from '../middlewares/JWT.js'

const router = Router()


router.post('/paciente/registro',verifyTokenJWT,registroPaciente)
router.get('/pacientes',verifyTokenJWT,listarPaciente)


export default router