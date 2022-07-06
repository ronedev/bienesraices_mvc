// const express = require('express')
import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'
import database from './config/database.js'

//Creacion de la app
const app = express()

//Conexion a la base de datos
try {
    await database.authenticate()
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
app.use('/auth', usuarioRoutes)



//Definir un puerto y arrancar el proyecto
const port = 3000
app.listen(port, ()=>{
    console.log(`Servidor corriendo en el puerto ${port}`)
})