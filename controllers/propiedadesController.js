import { unlink } from 'node:fs/promises'
import { validationResult } from 'express-validator'
import { Categoria, Precio, Propiedad, Mensaje, Usuario} from '../models/index.js'
import { isSeller, dateFormatter } from '../helpers/index.js'

const admin = async (req, res) =>{

    //Leer el query string para la paginacion
    const {page: actualPage} = req.query

    const expresionActualPage = /^[1-9]$/

    if(!expresionActualPage.test(actualPage)){
        return res.redirect('/my-properties?page=1')
    }

    try {
        const {id } = req.user

        //Limite y offset para la paginacion
        const limit = 5
        const offset = (actualPage * limit) - limit
    
        const [propiedades, total] = await Promise.all([
            Propiedad.findAll({
                limit,
                offset,
                where: {userId: id},
                include: [
                    {model: Categoria, as: 'categoria'},
                    {model: Precio, as: 'precio'},
                    {model: Mensaje, as: 'mensajes'}
                ]
            }),
            Propiedad.count({where: {userId: id}})
        ])
    
        res.render('propiedades/admin',{
            page: 'Mis propiedades',
            csrfToken: req.csrfToken(),
            propiedades,
            actualPage: Number(actualPage),
            totalPages: Math.ceil(total / limit),
            total,
            offset,
            limit
        })
    } catch (error) {
        console.log(error)
    }

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

//Cambiar estado de la propiedad
const changeState = async (req,res)=>{
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

    //Actualizar propiedad
    propiedad.published = !propiedad.published

    await propiedad.save()

    res.json({
        response: true
    })
}

//Muestra una propiedad
const getProperty = async (req, res) =>{
    const {id} = req.params

    //Validar si la propiedad existe
    const propiedad = await Propiedad.findByPk(id,{
        include: [
            {model: Categoria, as: 'categoria'},
            {model: Precio, as: 'precio'}
        ]
    })

    if(!propiedad || !propiedad.published){
        return res.redirect('/404')
    }

    res.render('propiedades/property',{
        page: `Propiedad: ${propiedad.title}`,
        propiedad,
        csrfToken: req.csrfToken(),
        user: req.user,
        isSeller: isSeller(req.user?.id, propiedad.userId)
    })
}

const sendMessage = async (req, res) =>{
    const {id} = req.params

    //Validar si la propiedad existe
    const propiedad = await Propiedad.findByPk(id,{
        include: [
            {model: Categoria, as: 'categoria'},
            {model: Precio, as: 'precio'}
        ]
    })

    if(!propiedad){
        return res.redirect('/404')
    }

    //Renderizar los errores en caso de tener
    let response = validationResult(req)

    if(!response.isEmpty()){

        return res.render('propiedades/property',{
            page: `Propiedad: ${propiedad.title}`,
            propiedad,
            csrfToken: req.csrfToken(),
            user: req.user,
            isSeller: isSeller(req.user?.id, propiedad.userId),
            errors: response.array()
        })
    }

    const {message} = req.body
    const {id: propertyId} = req.params
    const {id: userId} = req.user

    //Almacenar mensaje
    await Mensaje.create({
        message,
        propertyId,
        userId
    })


    res.render('propiedades/property',{
        page: `Propiedad: ${propiedad.title}`,
        propiedad,
        csrfToken: req.csrfToken(),
        user: req.user,
        isSeller: isSeller(req.user?.id, propiedad.userId),
        messageSent: true
    })
}

//Leer mensajes recibidos
const messages = async (req,res)=>{
    const {id} = req.params

    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            {model: Mensaje, as: 'mensajes',
                include: [
                    {model: Usuario.scope('deleteSensitiveInfo'), as: 'usuario'}
                ]
            }
        ]
    })

    if(!propiedad){
        return res.redirect('/my-properties')
    }

    //validar que el usuario activo sea el dueño de la publicacion
    if(req.user.id.toString() !== propiedad.userId.toString()){
        return res.redirect('/my-properties')
    }

    res.render('propiedades/mensajes',{
        page: 'Mensajes',
        messages: propiedad.mensajes,
        dateFormatter
    })
}

export{
    admin,
    create,
    saveProperty,
    addImage,
    storeImage,
    edit,
    saveEditProperty,
    deleteProperty,
    changeState,
    getProperty,
    sendMessage,
    messages
}