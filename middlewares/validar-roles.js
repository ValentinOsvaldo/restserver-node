const { response, request } = require('express');

const isAdminRol = (req = request, res = response, next) => {
  if (!req.user) {
    return res.status(500).json({
      message: 'Se requiere validar el rol',
    });
  }

  const { role, name } = req.user;

  if (role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      message: `${name} no es administrados - se necesita ser administrador`,
    });
  } else {
    next();
  }
};

const tieneRole = (...roles) => {
  return (req, res = response, next) => {
    if (!req.user) {
      return res.status(500).json({
        message: 'Se requiere validar el rol',
      });
    }

    if (!roles.includes( req.user.role )) {
      return res.status(401).json({
        message: `El servicio requiere uno de estos roles ${ roles }`
      })
    }

    next();
  }
}

module.exports = {
  isAdminRol,
  tieneRole
};
