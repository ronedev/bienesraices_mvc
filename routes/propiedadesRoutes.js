import express from 'express'
import { admin } from '../controllers/propiedadesController.js'

const router = express.Router()

router.get('/my-properties', admin)

export default router