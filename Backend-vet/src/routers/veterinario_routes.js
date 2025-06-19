import {Router} from 'express'
import { comprobarTokenPassword, confirmarMail, crearNuevoPassword, login, perfil, recuperarPassword, registro } from '../controllers/veterinario_controllers.js'
import { verifyTokenJWT } from '../middlewares/JWT.js'
const router = Router()

router.post('/registro',registro)


router.get('/confirmar/:token',confirmarMail)

//insercion de datos
router.post ('/recuperarpassword', recuperarPassword)
//leer token
router.get ('/recuperarpassword/:token', comprobarTokenPassword)

router.post('/nuevopassword/:token',crearNuevoPassword)

router.post('/login', login)

router.get('/perfil', verifyTokenJWT,perfil)
export default router