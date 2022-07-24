import express from 'express'
import { home, category, noFounded, searcher } from '../controllers/appController.js'

const router = express.Router()

//Pagina de inicio
router.get('/', home)

//Categorias
router.get('/category/:id', category)

//Pagina 404
router.get('/404', noFounded)

//Buscador
router.post('/searcher', searcher)

export default router