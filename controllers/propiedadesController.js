import { validationResult } from 'express-validator'
import Categoria from '../models/Categoria.js'
import Precio from '../models/Precio.js'

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
        precios
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
            errors: response.array()
        })
    }

}

export{
    admin,
    create,
    saveProperty
}