import jwt from "jsonwebtoken"
import { Usuario } from "../models/index.js"

const protectRoute = async (req, res, next) =>{
    //Validar si hay token
    const {_token} = req.cookies

    if(!_token){
        return res.redirect('/auth/login')
    }
    //Comprobar el token

    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRET)
        const user = await Usuario.findByPk(decoded.id)
        console.log(user)
    } catch (error) {
        return res.clearCookies('_token').redirect('/auth/login')
    }

    next()
}

export default protectRoute