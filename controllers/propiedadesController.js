import { validationResult } from 'express-validator'
import { Categoria, Precio, Propiedad} from '../models/index.js'

const admin = (req, res) =>{
    res.render('propiedades/admin',{
        page: 'Mis propiedades'
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
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            errors: response.array(),
            data: req.body
        })
    }

    //Crear registro

    const {title, description, category: categoryId, price: priceId, bedrooms, parking, wc, street, lat, lng} = req.body

    const {id: userId} = req.user

    try {
        const propiedad = await Propiedad.create({
            title,
            description,
            bedrooms,
            parking,
            wc,
            street,
            lat,
            lng,
            categoryId,
            priceId,
            userId,
            image: ''
        })

        const {id} = propiedad

        res.redirect(`/properties/add-image/${id}`)
    } catch (error) {
        console.log(error)
    }

}


const addImage = async (req, res)=>{

    //Validar que la propiedad exista
    const {id} = req.params

    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/my-properties')
    }

    //Validar que la propiedad no se encuentre publicada
    if(propiedad.confirmed){
        return res.redirect('my-properties')
    }

    //Validar que la propiedad pertenece al usuario autenticado
    if(req.user.id.toString() !== propiedad.userId.toString()){
        return res.redirect('/my-properties')
    }

    res.render('propiedades/add-image',{
        page: 'Agregar imagen',
        csrfToken: req.csrfToken(),
        // categorias,
        // precios,
        // errors: response.array(),
        // data: req.body
    })
}

export{
    admin,
    create,
    saveProperty,
    addImage
}