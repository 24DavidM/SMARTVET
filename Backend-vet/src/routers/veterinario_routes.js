import {Router} from 'express'
import {actualizarPassword, actualizarperfil, comprobarTokenPassword, confirmarMail, crearNuevoPassword, login, perfil, recuperarPassword, registro } from '../controllers/veterinario_controllers.js'
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
router.put('/veterinario/:id',verifyTokenJWT,actualizarperfil)
router.put('/veterinario/actualizarpassword/:id',verifyTokenJWT,actualizarPassword)


export default router