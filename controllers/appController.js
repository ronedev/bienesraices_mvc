import { Precio, Categoria, Propiedad } from '../models/index.js'

const home = async (req, res)=>{

    const [categorias, precios, casas, departamentos] = await Promise.all([
        Categoria.findAll({raw: true}),
        Precio.findAll({raw: true}),
        Propiedad.findAll({
            limit: 3,
            where:{ categoryId: 1 },
            include: [
                {model: Precio, as: 'precio'},
                {model: Categoria, as: 'categoria'},
            ],
            order: [['createdAt', 'DESC']]
        }),
        Propiedad.findAll({
            limit: 3,
            where:{ categoryId: 2 },
            include: [
                {model: Precio, as: 'precio'},
                {model: Categoria, as: 'categoria'},
            ],
            order: [['createdAt', 'DESC']]
        })
    ])

    res.render('home', {
        page: 'Home',
        categorys: categorias,
        prices: precios,
        homes: casas,
        dptos: departamentos
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