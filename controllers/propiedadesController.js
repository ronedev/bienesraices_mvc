import { unlink } from 'node:fs/promises'
import { validationResult } from 'express-validator'
import { Categoria, Precio, Propiedad} from '../models/index.js'

const admin = async (req, res) =>{

    const {id } = req.user

    const propiedades = await Propiedad.findAll({
            where: {userId: id},
            include: [
                {model: Categoria, as: 'categoria'},
                {model: Precio, as: 'precio'}
            ]
        })

    res.render('propiedades/admin',{
        page: 'Mis propiedades',
        csrfToken: req.csrfToken(),
        propiedades
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
        page: `Agregar imagen: ${propiedad.title}`,
        csrfToken: req.csrfToken(),
        propiedad
        // categorias,
        // precios,
        // errors: response.array(),
        // data: req.body
    })
}

const storeImage = async (req, res, next)=>{
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

    try {
        //Almacenar la referencia de la imagen y cambiar estado de publicacion
        propiedad.image = req.file.filename //El req.file nos lo provee multer al usar el middleware de uploadImage
        propiedad.published = 1

        await propiedad.save()

        next()

    } catch (error) {
        console.log(error)
    }
}

const edit = async (req, res)=>{
    const {id} = req.params

    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/my-properties')
    }
    //validar que el usuario activo sea el dueño de la publicacion
    if(req.user.id.toString() !== propiedad.userId.toString()){
        return res.redirect('/my-properties')
    }

    //Consultar modelo de precios y categorias
    const [categorias, precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    return res.render('propiedades/editar',{
        page: `Editar propiedad ${propiedad.title}`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        data: propiedad
    })
}

const saveEditProperty = async (req, res)=>{

    //Validar que no haya errores en el form
    let response = validationResult(req)

    if(!response.isEmpty()){

        //Consultar modelo de precios y categorias
        const [categorias, precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

        return res.render('propiedades/editar',{
            page: `Editar propiedad`,
            csrfToken: req.csrfToken(),
            categorias,
            precios,
            data: req.body,
            errors: response.array()
        })
    }

    const {id} = req.params

    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/my-properties')
    }

    //validar que el usuario activo sea el dueño de la publicacion
    if(req.user.id.toString() !== propiedad.userId.toString()){
        return res.redirect('/my-properties')
    }

    //Reescribir el objeto y actualizarlo
    try {
        const {title, description, category: categoryId, price: priceId, bedrooms, parking, wc, street, lat, lng} = req.body

        propiedad.set({
            title,
            description,
            bedrooms,
            parking,
            wc,
            street,
            lat,
            lng,
            categoryId,
            priceId
        })

        await propiedad.save()

        res.redirect('/my-properties')
        
    } catch (error) {
        console.log(error)
    }
}

const deleteProperty = async (req, res)=>{
    const {id} = req.params

    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/my-properties')
    }

    //validar que el usuario activo sea el dueño de la publicacion
    if(req.user.id.toString() !== propiedad.userId.toString()){
        return res.redirect('/my-properties')
    }

    //Eliminar la imagen de la propiedad
    await unlink(`public/uploads/${propiedad.image}`)

    //Eliminar propiedad
    await propiedad.destroy()
    res.redirect('/my-properties')

}

export{
    admin,
    create,
    saveProperty,
    addImage,
    storeImage,
    edit,
    saveEditProperty,
    deleteProperty
}