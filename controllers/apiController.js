import { Propiedad, Precio, Categoria } from '../models/index.js'

const properties = async (req,res) =>{

    const propiedades = await Propiedad.findAll({
        include: [
            {model: Precio, as: 'precio'},
            {model: Categoria, as: 'categoria'},
        ]
    })

    res.json(propiedades)
}

export {
    properties
}