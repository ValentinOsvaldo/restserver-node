const Role = require('../models/role');
const User = require('../models/user');
const Categoria = require('../models/categoria');
const { Producto } = require('../models');

const isValidRole = async (role = '') => {
  const rolExist = await Role.findOne({ role });

  if (!rolExist) {
    throw new Error(`El rol ${role} no esta registrado en la base de datos`);
  }
};

const emailExist = async (email = '') => {
  const existEmail = await User.findOne({ email });

  if (existEmail) {
    throw new Error(`El email ${email} no esta registrado en la base de datos`);
  }
};

const existUserId = async (id) => {
  const existUser = await User.findById(id);

  if (!existUser) throw new Error(`El id no existe`);
};

const existCategoryId = async (id) => {
  const existCategory = await Categoria.findById(id);

  if (!existCategory) throw new Error('No existe el ID');
};

const existProductId = async (id) => {
  const existProduct = await Producto.findById(id);

  if (!existProduct) throw new Error('No existe ese ID para este producto')
}

module.exports = {
  isValidRole,
  emailExist,
  existUserId,
  existCategoryId,
  existProductId
};
