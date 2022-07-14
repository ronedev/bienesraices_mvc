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
        categorias,
        precios
    })
}

export{
    admin,
    create
}