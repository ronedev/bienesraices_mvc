import express from 'express'
import { comprobarToken, confirmarRegistro, formularioLogin, formularioOlvideContraseña, formularioRegistro, nuevoPassword, registrar, resetPassword } from '../controllers/usuariosController.js'

const router = express.Router()

router.get('/login', formularioLogin)

router.get('/signup', formularioRegistro)
router.post('/signup', registrar)

router.get('/confirmar-registro/:token', confirmarRegistro)

router.get('/forgot-password', formularioOlvideContraseña)
router.post('/forgot-password', resetPassword)

//Almacenar y restablecer la contraseña
router.get('/forgot-password/:token', comprobarToken)
router.post('/forgot-password/:token', nuevoPassword)

export default router