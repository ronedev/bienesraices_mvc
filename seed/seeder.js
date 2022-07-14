import categorias from "./categorias.js";
import precios from "./precios.js";
import usuarios from "./usuarios.js";
import database from "../config/database.js";
import { Categoria, Precio, Usuario } from '../models/index.js'

const importarDatos = async ()=>{
    try {
        //Autenticar
        await database.authenticate()

        //Generar columnas
        await database.sync()

        //Insertar los datos

        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)
        ])

        console.log('Datos insertados correctamente')

        process.exit()
    } catch (error) {
        console.log(error)
        process.exit(1) //Lleva el 1 como argumento porque los procesos se han finalizado de ejecutar con errores
    }
}

const eliminarDatos = async ()=>{
    try {
        await database.sync({force: true})
        console.log('Datos eliminados correctamente')

        process.exit()
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

if(process.argv[2] === '-i'){
    importarDatos()
}

if(process.argv[2] === '-d'){
    eliminarDatos()
}