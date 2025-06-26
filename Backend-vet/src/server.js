//REQUERIR MODULOS
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routerVeterinarios from './routers/veterinario_routes.js'
import routerPacientes from './routers/paciente_router.js'

// INICIALIZAR
const app = express()
dotenv.config()

//CONFIGUARCION
app.set('port',process.env.PORT || 3000)
app.use(cors())

//MIDDLEWARE
app.use(express.json())

//RUTAS
app.get('/',(req,res)=>{
    res.send("Server On")
})

//Rutas para veterinarios
app.use('/api',routerVeterinarios)

//Rutas para pacientes
app.use('/api',routerPacientes)

//Ruta que no existen
app.use((req,res) =>{res.status(404).send("Endpoint no encontrado")})


//EXPORTACION A LA INSTANCIA DE LA APPs
export default app