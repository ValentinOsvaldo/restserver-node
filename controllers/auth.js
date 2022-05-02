const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const generarJWT = require('../helpers/generarJWT');

const login = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    // todo: verificar si el email existe
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: 'Usuario / Password no son correctos - email',
      });
    }

    // Si el usuario esta activo
    if (!user.state) {
      return res.status(400).json({
        message: 'Usuario / Password no son correctos - state: false',
      });
    }

    // verificar la contraseña
    const isValidPassword = bcryptjs.compareSync(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({
        message: 'Usuario / Password no son correctos - password',
      });
    }

    // Generar el JWT
    const token = await generarJWT(user.id);

    res.json({
      user,
      token
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Hable con el administrador',
    });
  }
};

module.exports = {
  login,
};
