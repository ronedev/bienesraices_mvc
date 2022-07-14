import express from 'express'
import { body } from 'express-validator'
import { admin, create, saveProperty } from '../controllers/propiedadesController.js'

const router = express.Router()

router.get('/my-properties', admin)
router.get('/properties/create', create)
router.post('/properties/create', 
    body('title').notEmpty().withMessage('Debe ingresar un título para su propiedad'),
    saveProperty
)

export default router