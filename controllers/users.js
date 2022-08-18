const { response, request } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user'); // * model
const { findByIdAndUpdate } = require('../models/user');

// ? GET USERS
const usersGet = async (req = request, res = response) => {
  const { limit = 5, from = 0 } = req.query;

  const [ total, users ] = await Promise.all([
    User.countDocuments({ state: true }),
    User.find({ state: true }).limit(Number(limit)).skip(Number(from)),
  ]);

  res.json({
    total,
    users
  });
};

// ? POST USERS
const usersPost = async (req = request, res = response) => {
  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  // todo: Encriptar la contraseña
  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(password, salt);

  // Guardar DB
  await user.save();

  res.json({
    user,
  });
};

// ? PUT USERS
const usersPut = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, password, google, email, ...resto } = req.body;

  if (password) {
    const salt = bcrypt.genSaltSync();
    resto.password = bcrypt.hashSync(password, salt);
  }

  const usuario = await User.findByIdAndUpdate(id, resto);

  res.json(usuario);
};

// ! DELETE USERS
const usersDelete = async (req = request, res = response) => {
  const { id } = req.params;

  // * Cambiar estado
  const user = await User.findByIdAndUpdate( id, { state: false } );

  res.json(user);
};

module.exports = {
  usersGet,
  usersPost,
  usersPut,
  usersDelete,
};
