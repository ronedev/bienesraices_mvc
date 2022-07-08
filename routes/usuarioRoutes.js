import express from 'express'
import { confirmarRegistro, formularioLogin, formularioOlvideContraseña, formularioRegistro, registrar } from '../controllers/usuariosController.js'

const router = express.Router()

router.get('/login', formularioLogin)

router.get('/signup', formularioRegistro)
router.post('/signup', registrar)

router.get('/confirmar-registro/:token', confirmarRegistro)

router.get('/forgot-password', formularioOlvideContraseña)

export default router