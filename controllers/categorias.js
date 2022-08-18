const { response, request } = require('express');
const { Categoria } = require('../models');

// ObtenerCategorias - Paginado - Total - Populate
const obtenerCategorias = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;

  const [total, categorias] = await Promise.all([
    Categoria.countDocuments({ estado: true }),
    Categoria.find({ estado: true })
      .limit(Number(limit))
      .skip(Number(from))
      .populate('usuario', 'name'),
  ]);

  res.status(200).json({
    categorias,
    total,
  });
};

// ObtenerCategoria - populate {}
const obtenerCategoria = async (req = request, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findById(id).populate('usuario', 'name');

  res.status(200).json(categoria);
};

const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();
  const categoriaDB = await Categoria.findOne({ nombre });

  if (categoriaDB) {
    return res.status(400).json({
      message: `La categoria ${categoriaDB.nombre}, ya existe`,
    });
  }

  const data = {
    nombre,
    usuario: req.user._id,
  };

  const categoria = new Categoria(data);
  await categoria.save();

  res.status(201).json(categoria);
};

// Actualizar categoria
const actualizarCategoria = async (req = request, res = response) => {
  const { id } = req.params;
  const { usuario, estado, ...data } = req.body;

  data.nombre = data.nombre.toUpperCase();
  data.usuario = req.user._id;

  const categoria = await Categoria.findByIdAndUpdate(id, data);

  res.json(categoria);
};

// Borrar Categoria - estado: false
const borrarCategoria = async (req, res = response) => {
  const { id } = req.params;

  const categoria = await Categoria.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json(categoria);
};

module.exports = {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
};
