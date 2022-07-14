import { DataTypes } from 'sequelize'
import db from '../config/database.js'

const Precio = db.define('precios', {
    name: {
        type: DataTypes.STRING(30),
        allowNull: false
    }
})

export default Precio