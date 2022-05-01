const { Schema, model } = require('mongoose');

const UserSchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
  },
  email: {
    type: String,
    required: [true, 'El correo es obligatorio'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'El contraseña es obligatorio'],
  },
  role: {
    type: String,
    required: [true, 'El rol es obligatorio'],
    emun: ['ADMIN_ROLE', 'USER_ROLE'],
  },
  img: {
    type: String,
  },
  state: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },
});

UserSchema.methods.toJSON = function () {
  const { __v, password, ...user } = this.toObject();

  return user;
};

module.exports = model('Usuario', UserSchema);
