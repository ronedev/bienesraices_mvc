import express from 'express'
import { body } from 'express-validator'
import { addImage, admin, create, deleteProperty, edit, getProperty, saveEditProperty, saveProperty, storeImage } from '../controllers/propiedadesController.js'
import protectRoute from '../middleware/protectRoute.js'
import upload from '../middleware/uploadImage.js'

const router = express.Router()

//RUTAS PRIVADAS

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

router.get('/properties/add-image/:id',protectRoute, addImage)

router.post('/properties/add-image/:id', protectRoute, upload.single('image'), storeImage)

router.get('/propetries/edit/:id', protectRoute, edit)
router.post('/propetries/edit/:id',
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
    saveEditProperty
)

router.post('/propetries/delete/:id', protectRoute, deleteProperty)

//RUTAS PÚBLICAS
router.get('/property/:id', getProperty)

export default router