const admin = (req, res) =>{
    res.render('propiedades/admin',{
        page: 'Mis propiedades',
        navbar: true
    })
}

export{
    admin
}