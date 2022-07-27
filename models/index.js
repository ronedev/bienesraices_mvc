import Categoria from "./Categoria.js";
import Mensaje from "./Mensaje.js";
import Precio from "./Precio.js";
import Propiedad from "./Propiedad.js";
import Usuario from "./Usuario.js";

//Relaciones entre las tablas

//Relacion de 1:1 entre propiedad y precio, donde la foreign key en propiedad se llamara precioId
// Precio.hasOne(Propiedad, {foreignKey: 'priceId'}) // Tambien puede ser => Propiedad.belongsTo(Precio, {foreignKey: 'precioId'})
Propiedad.belongsTo(Precio, {foreignKey: 'priceId'})

//Relacion de 1:1 entre propiedad y categoria, donde la foreign key en propiedad se llamara categoriaId
Propiedad.belongsTo(Categoria, {foreignKey: 'categoryId'})
// Categoria.hasOne(Propiedad, {foreignKey: 'categoryId'})
Propiedad.hasMany(Mensaje, {foreignKey: 'propertyId'})

//Relacion de 1:1 entre propiedad y categoria, donde la foreign key en propiedad se llamara userId
Usuario.hasOne(Propiedad, {foreignKey: 'userId'})

Mensaje.belongsTo(Propiedad, {foreignKey: 'propertyId'})
Mensaje.belongsTo(Usuario, {foreignKey: 'userId'})

export {
    Categoria,
    Precio,
    Propiedad,
    Usuario,
    Mensaje
}