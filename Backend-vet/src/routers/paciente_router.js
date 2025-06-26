import {Router} from 'express'
import { registroPaciente } from '../controllers/paciente_controllers.js'

const router = Router()


router.post('/paciente/registro',registroPaciente)

export default router