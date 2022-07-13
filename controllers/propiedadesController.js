const admin = (req, res) =>{
    res.render('propiedades/admin',{
        page: 'Mis propiedades',
        navbar: true
    })
}

const create = (req,res)=>{
    res.render('propiedades/create',{
        page: 'Crear propiedad',
        navbar: true
    })
}

export{
    admin,
    create
}