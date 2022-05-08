const { response, request, json } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const generarJWT = require('../helpers/generarJWT');
const { googleVerify } = require('../helpers/google-verify');

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
      token,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Hable con el administrador',
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, img, email } = await googleVerify(id_token);

    let user = await User.findOne({ email });

    if (!user) {
      // todo crear usuario
      const data = {
        name,
        email,
        password: ':p',
        img,
        role: 'USER_ROLE',
        google: true,
      };

      user = new User(data);
      await user.save();
    }

    // Si el usuario en DB
    if (!user.state) {
      return res.status(401).json({
        message: 'Hable con el administrador - Usuario bloqueado',
      });
    }

    // Generar el JWT
    const token = await generarJWT(user.id);

    res.json({
      user,
      token,
    });
  } catch (error) {
    console.error(error)

    res.status(400).json({
      ok: false,
      message: 'EL token no se pudo verificar',
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
