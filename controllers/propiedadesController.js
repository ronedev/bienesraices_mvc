import { validationResult } from 'express-validator'
import { Categoria, Precio, Propiedad} from '../models/index.js'

const admin = (req, res) =>{
    res.render('propiedades/admin',{
        page: 'Mis propiedades',
        navbar: true
    })
}

const create = async (req,res)=>{

    //Consultar modelo de precios y categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('propiedades/create',{
        page: 'Crear propiedad',
        navbar: true,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        data: {}
    })
}

const saveProperty = async (req, res) =>{

    let response = validationResult(req)

    if(!response.isEmpty()){

        //Consultar modelo de precios y categorias
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

        res.render('propiedades/create',{
            page: 'Crear propiedad',
            navbar: true,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errors: response.array(),
            data: req.body
        })
    }

    //Crear registro

    const {title, description, category: categoryId, price: priceId, bedrooms, parking, wc, street, lat, lng} = req.body

    try {
        const propiedad = await Propiedad.create({
            title,
            description,
            categoryId,
            priceId,
            bedrooms,
            parking,
            wc,
            street,
            lat,
            lng
        })
    } catch (error) {
        console.log(error)
    }

}

export{
    admin,
    create,
    saveProperty
}