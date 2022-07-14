import express from 'express'
import { body } from 'express-validator'
import { addImage, admin, create, saveProperty } from '../controllers/propiedadesController.js'
import protectRoute from '../middleware/protectRoute.js'

const router = express.Router()

router.get('/my-properties',protectRoute, admin)
router.get('/properties/create',protectRoute, create)
router.post('/properties/create',
    protectRoute,
    body('title').notEmpty().withMessage('Debe ingresar un título para su propiedad'),
    body('description')
        .notEmpty().withMessage('Debe ingresar una descripción para su propiedad')
        .isLength({max: 200}).withMessage('La descripción excede el máximo de caracteres'),
    body('category').isNumeric().withMessage('Selecciona una categoria'),
    body('price').isNumeric().withMessage('Selecciona un rango de precios'),
    body('bedrooms').isNumeric().withMessage('Selecciona la cantidad de habitaciones'),
    body('parking').isNumeric().withMessage('Selecciona la cantidad de estacionamientos disponibles'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de baños disponibles'),
    body('lat').notEmpty().withMessage('Ubica tu propiedad en el mapa'),
    saveProperty
)

router.get('/properties/add-image/:id', addImage)

export default router