import { Precio, Categoria, Propiedad } from "../models/index.js";

const home = async (req, res) => {
  const [categorias, precios, casas, departamentos] = await Promise.all([
    Categoria.findAll({ raw: true }),
    Precio.findAll({ raw: true }),
    Propiedad.findAll({
      limit: 3,
      where: { categoryId: 1 },
      include: [
        { model: Precio, as: "precio" },
        { model: Categoria, as: "categoria" },
      ],
      order: [["createdAt", "DESC"]],
    }),
    Propiedad.findAll({
      limit: 3,
      where: { categoryId: 2 },
      include: [
        { model: Precio, as: "precio" },
        { model: Categoria, as: "categoria" },
      ],
      order: [["createdAt", "DESC"]],
    }),
  ]);

  res.render("home", {
    page: "Home",
    categorys: categorias,
    prices: precios,
    homes: casas,
    dptos: departamentos,
  });
};
const category = async (req, res) => {
  const { id } = req.params;

  //Comprobar que la categoria que visitamos exista
  const categoria = await Categoria.findByPk(id);
  if (!categoria) {
    return res.redirect("/404");
  }

  //Obtener las propiedades de esa categoria
  const propiedades = await Propiedad.findAll({
    where: { categoryId: id },
    include: [
      { model: Categoria, as: "categoria" },
      { model: Precio, as: "precio" },
    ],
  });

  res.render("category", {
    page: `${categoria.name}s en venta`,
    propiedades,
  });
};

const noFounded = (req, res) => {
  res.render("404", {
    page: "No encontrada",
  });
};

const searcher = (req, res) => {};

export { home, category, noFounded, searcher };
