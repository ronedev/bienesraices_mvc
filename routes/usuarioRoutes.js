import express from 'express'
import { formularioLogin, formularioRegistro } from '../controllers/usuariosController.js'

const router = express.Router()

router.get('/login', formularioLogin)
router.get('/signup', formularioRegistro)

export default router