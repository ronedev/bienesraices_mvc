import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js'

const identifyUser = async (req, res, next) =>{
    //Identificar si hay un usuario
    const userToken = req.cookies._token

    if(!userToken){
        req.user = null
        return next()
    }
    //Comprobar el token
}

export default identifyUser