import Categoria from "./Categoria.js";
import Precio from "./Precio.js";
import Propiedad from "./Propiedad.js";
import Usuario from "./Usuario.js";

//Relaciones entre las tablas

//Relacion de 1:1 entre propiedad y precio, donde la foreign key en propiedad se llamara precioId
Precio.hasOne(Propiedad, {foreignKey: 'priceId'}) // Tambien puede ser => Propiedad.belongsTo(Precio, {foreignKey: 'precioId'})

//Relacion de 1:1 entre propiedad y categoria, donde la foreign key en propiedad se llamara categoriaId
Categoria.hasOne(Propiedad, {foreignKey: 'categoryId'})

//Relacion de 1:1 entre propiedad y categoria, donde la foreign key en propiedad se llamara categoriaId
Usuario.hasOne(Propiedad, {foreignKey: 'userId'})

export {
    Categoria,
    Precio,
    Propiedad,
    Usuario
}