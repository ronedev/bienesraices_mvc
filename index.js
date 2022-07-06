// const express = require('express')
import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'

//Creacion de la app
const app = express()

app.set('view engine', 'pug')
app.set('views', './views')

//Routing
app.use('/auth', usuarioRoutes)



//Definir un puerto y arrancar el proyecto
const port = 3000
app.listen(port, ()=>{
    console.log(`Servidor corriendo en el puerto ${port}`)
})