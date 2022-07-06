import Sequelize from "sequelize";
import dotenv from 'dotenv'

dotenv.config({path: '.env'})

const database = new Sequelize(process.env.BD_NAME, process.env.BD_USER, process.env.BD_PASSWORD, {
    host: process.env.BD_HOST,
    port: 3306,
    dialect: 'mysql',
    define:{
        timestamps: true
    },
    pool:{
        max: 5,
        min: 0,
        acquire: 30000, //milisegundos de espera antes de marcar un error en la conexion
        idle: 10000 //milisegundos que debe pasar inactiva para que la conexion finalice
    },
    operatorAliases: false
})

export default database