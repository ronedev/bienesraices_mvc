// const express = require('express')
import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import database from './config/database.js'

//Creacion de la app
const app = express()

//Habilitar lectura de datos
app.use(express.urlencoded({extended: true}))

//Habilitar cookie-parser
app.use( cookieParser() )

//Habilitar CSRF
app.use(csrf({cookie: true}))

//Conexion a la base de datos
try {
    await database.authenticate()
    database.sync()
    console.log('Conexion correcta a la base de datos')
} catch (error) {
    console.log(error)
}

//Habilitar pug (pug es el template engine que se utilizara en este proyecto)
app.set('view engine', 'pug')
app.set('views', './views')

//Carpeta publica
app.use( express.static('public'))

//Routing
app.use('/', appRoutes)
app.use('/auth', usuarioRoutes)
app.use('/', propiedadesRoutes)
app.use('/api', apiRoutes)

//Definir un puerto y arrancar el proyecto
const port = 3000
app.listen(port, ()=>{
    console.log(`Servidor corriendo en el puerto ${port}`)
})