const { response, request } = require('express');
const { Usuario, Categoria, Producto } = require('../models');
const { ObjectId } = require('mongoose').Types;

const coleccionesPermitidas = ['usuarios', 'categorias', 'productos'];

const buscarUsuarios = async (termino = '', res = response) => {
  const isMongoId = ObjectId.isValid(termino);

  if (isMongoId) {
    const usuario = await Usuario.findById(termino);

    res.json({
      results: usuario ? [usuario] : [],
    });
  } else {
    const regex = new RegExp(termino, 'i');
    const usuario = await Usuario.find({
      $or: [{ name: regex }, { correo: regex }],
      $and: [{ state: true }],
    });

    res.json({
      results: usuario ? [usuario] : [],
    });
  }
};

const buscarCategoria = async (termino = '', res = response) => {
  const isMongoId = ObjectId.isValid(termino);

  if (isMongoId) {
    const categoria = await Categoria.findById(termino);

    res.json({
      results: categoria ? [categoria] : [],
    });
  } else {
    const regex = new RegExp(termino, 'i');
    const categoria = await Categoria.find({
      nombre: regex,
      estado: true,
    });

    res.json({
      results: categoria ? [categoria] : [],
    });
  }
};

const buscarProducto = async (termino = '', res = response) => {
  const isMongoId = ObjectId.isValid(termino);

  if (isMongoId) {
    const producto = await Producto.findById(termino).populate(
      'categoria',
      'nombre'
    );

    res.json({
      results: producto ? [producto] : [],
    });
  } else {
    const regex = new RegExp(termino, 'i');
    const producto = await Producto.find({
      nombre: regex,
      estado: true,
    }).populate('categoria', 'nombre');

    res.json({
      results: producto ? [producto] : [],
    });
  }
};

const buscar = (req = request, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      message: `Las colecciones permitidas son ${coleccionesPermitidas}`,
    });
  }

  switch (coleccion) {
    case 'usuarios':
      buscarUsuarios(termino, res);
      break;
    case 'categorias':
      buscarCategoria(termino, res);
      break;
    case 'productos':
      buscarProducto(termino, res);
      break;

    default:
      res.status(500).json({
        message: 'Se me olvido hacer esta busqueda',
      });
      break;
  }
};

module.exports = {
  buscar,
};
