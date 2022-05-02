const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header('x-token');

  if (!token) {
    return res.status(401).json({
      message: 'No hay token en la petición',
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // TODO: leer usuario que corresponde al uid
    const user = await User.findById(uid);

    if (!user) {
      return res.json({
        message: 'Token no valido - no existe el usuario',
      });
    }

    // * Verificar si el uid tiene state: true
    if (!user.state) {
      return res.status(401).json({
        message: 'Token no valido',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({
      message: 'Token no valido',
    });
  }
};

module.exports = {
  validarJWT,
};
