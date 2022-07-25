import { Precio, Categoria, Propiedad } from '../models/index.js'

const home = async (req, res)=>{

    const [categorias, precios] = await Promise.all([
        Categoria.findAll({raw: true}),
        Precio.findAll({raw: true})
    ])

    res.render('home', {
        page: 'Home',
        categorys: categorias,
        prices: precios
    })
}
const category = (req, res)=>{

}
const noFounded = (req, res)=>{

}

const searcher = (req, res)=>{

}

export{
    home, category, noFounded, searcher
}