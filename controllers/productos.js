const { request, response } = require('express');
const { Producto } = require('../models');

const obtenerProductos = async (req, res) => {
  const { limit = 5, from = 0 } = req.query;

  const [total, productos] = await Promise.all([
    Producto.countDocuments({ estado: true }),
    Producto.find({ estado: true })
      .limit(Number(limit))
      .skip(Number(from))
      .populate('usuario', 'name')
      .populate('categoria', 'nombre'),
  ]);

  res.status(200).json({
    productos,
    total,
  });
};

const obtenerProducto = async (req = request, res = response) => {
  const { id } = req.params;

  const producto = await Producto.findById(id)
    .populate('usuario', 'name')
    .populate('categoria', 'nombre');

  res.status(200).json(producto);
};

const crearProducto = async (req = request, res = response) => {
  const { estado, usuario, ...body } = req.body,
    productoDB = await Producto.findOne({ nombre: body.nombre });

  if (productoDB) {
    return res.status(400).json({
      message: `El producto ${productoDB.nombre}, ya existe`,
    });
  }

  const data = {
    ...body,
    nombre: body.nombre.toUpperCase(),
    usuario: req.user._id,
  };

  const producto = new Producto(data);
  await producto.save();

  res.status(201).json(producto);
};

const actualizarProducto = async (req, res) => {
  const { id } = req.params;
  const { usuario, estado, ...data } = req.body;

  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }

  data.usuario = req.user._id;

  const producto = await Producto.findByIdAndUpdate(id, data);

  res.json(producto);
};

const eliminarProducto = async (req, res) => {
  const { id } = req.params;

  const producto = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );

  res.json(producto);
};

module.exports = {
  obtenerProducto,
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
