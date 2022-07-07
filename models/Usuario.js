import {DataTypes} from 'sequelize'
import database from '../config/database.js'

const Usuario = database.define('usuarios', {
    name:{
        type: DataTypes.STRING,
        allowNull: false
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false
    },
    token: DataTypes.STRING,
    confirmed: DataTypes.BOOLEAN
})

export default Usuario