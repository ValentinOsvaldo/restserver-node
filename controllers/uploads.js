const fs = require('fs');
const path = require('path');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response, request } = require('express');
const { subirArchivo } = require('../helpers');
const { Producto, Usuario } = require('../models');

const cargarArchivo = async (req = request, res = response) => {
  try {
    const pathCompleto = await subirArchivo(req.files, ['txt', 'md'], 'texts');

    res.status(200).json({
      path: pathCompleto,
    });
  } catch (error) {
    res.status(400).json({
      message: error,
    });
  }
};

const actualizarArchivo = async (req, res = response) => {
  const { coleccion, id } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);

      if (!modelo) {
        return res
          .status(400)
          .json({ message: 'No existe el usuario con ese ID' });
      }
      break;
    case 'productos':
      modelo = await Producto.findById(id);

      if (!modelo) {
        return res
          .status(400)
          .json({ message: 'No existe el usuario con ese ID' });
      }
      break;

    default:
      return res.status(500).json({ message: 'Se me olvido validar esto :(' });
  }

  // Limpiar imagenes previas

  if (modelo.img) {
    // Hay que borrar la imagen
    const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img);

    if (fs.existsSync(pathImage)) {
      fs.unlinkSync(pathImage);
    }
  }

  const nombre = await subirArchivo(req.files, undefined, coleccion);
  modelo.img = nombre;

  await modelo.save();

  res.json(modelo);
};

const mostrarImagen = async (req, res = response) => {
  const { coleccion, id } = req.params;

  let modelo;

  /* Checking if the collection is either 'usuarios' or 'productos' and if it is, it will return the
  model. */
  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);

      if (!modelo) {
        return res
          .status(400)
          .json({ message: 'No existe el usuario con ese ID' });
      }
      break;
    case 'productos':
      modelo = await Producto.findById(id);

      if (!modelo) {
        return res
          .status(400)
          .json({ message: 'No existe el usuario con ese ID' });
      }
      break;

    default:
      return res.status(500).json({ message: 'Se me olvido validar esto :(' });
  }

  /* Checking if the image exists and if it does, it will send the image. */
  if (modelo.img) {
    // const pathImage = path.join(__dirname, '../uploads', coleccion, modelo.img);
    // if (fs.existsSync(pathImage)) {
    //   return res.sendFile(pathImage);
    // }
    return res.redirect(modelo.img)
  }

  const pathImage = path.join(__dirname, '../assets', 'no-image.jpg');
  res.sendFile(pathImage);
};

const actualizarArchivoCloud = async (req, res = response) => {
  const { coleccion, id } = req.params;

  let modelo;

  switch (coleccion) {
    case 'usuarios':
      modelo = await Usuario.findById(id);

      if (!modelo) {
        return res
          .status(400)
          .json({ message: 'No existe el usuario con ese ID' });
      }
      break;
    case 'productos':
      modelo = await Producto.findById(id);

      if (!modelo) {
        return res
          .status(400)
          .json({ message: 'No existe el usuario con ese ID' });
      }
      break;

    default:
      return res.status(500).json({ message: 'Se me olvido validar esto :(' });
  }

  // Limpiar imagenes previas

  if (modelo.img) {
    const nombreArr = modelo.img.split('/');
    const nombre = nombreArr[nombreArr.length - 1]
    const [ public_id ] = nombre.split('.')

    await cloudinary.uploader.destroy(public_id)
  }

  const { tempFilePath } = req.files.archivo;
  const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
  modelo.img = secure_url;

  await modelo.save();

  res.json(modelo);
};

module.exports = {
  cargarArchivo,
  actualizarArchivo,
  mostrarImagen,
  actualizarArchivoCloud,
};
