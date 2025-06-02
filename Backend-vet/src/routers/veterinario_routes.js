import {Router} from 'express'
import { confirmarMail, registro } from '../controllers/veterinario_controllers.js'
const router = Router()

router.post('/registro',registro)

router.get('/confirmar/token:token',confirmarMail)

//insercion de datos
router.post ('/recuperarpassword', recuperarPassword)
//leer token
router.get ('/recuperarpassword/:token', comprobarTokenPassword)

router.post('/nuevopassword',crearNuevoPassword)

export default router