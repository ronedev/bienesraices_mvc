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
    try {
        const decoded = jwt.verify(userToken, process.env.JWT_SECRET)
        const user = await Usuario.scope('deleteSensitiveInfo').findByPk(decoded.id)
        
        if(user){
            req.user = user
        }

        return next()
    } catch (error) {
        console.log(error)
        return res.clearCookie('_token').redirect('/auth/login')
    }
}

export default identifyUser