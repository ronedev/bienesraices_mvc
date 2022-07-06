import express from 'express'
import { formularioLogin, formularioOlvideContraseña, formularioRegistro } from '../controllers/usuariosController.js'

const router = express.Router()

router.get('/login', formularioLogin)
router.get('/signup', formularioRegistro)
router.get('/forgot-password', formularioOlvideContraseña)

export default router