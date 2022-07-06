// const express = require('express')
import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'

//Creacion de la app
const app = express()

//Routing
app.use('/', usuarioRoutes)



//Definir un puerto y arrancar el proyecto
const port = 3000
app.listen(port, ()=>{
    console.log(`Servidor corriendo en el puerto ${port}`)
})