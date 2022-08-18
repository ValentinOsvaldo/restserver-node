const { Router } = require('express');
const {
  obtenerProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} = require('../controllers/productos');
const { validarCampos, validarJWT, isAdminRol } = require('../middlewares');
const { check } = require('express-validator');
const { existCategoryId, existProductId } = require('../helpers/db-validators');

const router = Router();

// * Obtener Productos - publico
router.get('/', obtenerProductos);

// * Obtener Producto por ID - publico
router.get('/:id', obtenerProducto);

// * Crear un producto - Privado, cualquier persona con un token valido
router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'La categoria es obligatorio').not().isEmpty(),
    check('categoria', 'No es un ID de Mongo').isMongoId(),
    check('categoria').custom(existCategoryId),
    validarCampos,
  ],
  crearProducto
);

// * Actualizar un producto - Privado - Cualquier token valido
router.put(
  '/:id',
  [
    validarJWT,
    check('id', 'No es un ID de Mongo').isMongoId(),
    check('id').custom(existProductId),
    validarCampos,
  ],
  actualizarProducto
);

// * Eliminar un producto (Solo Administrador)
router.delete(
  '/:id',
  [
    validarJWT,
    isAdminRol,
    check('id', 'No es un ID de Mongo').isMongoId(),
    check('id').custom(existProductId),
    validarCampos,
  ],
  eliminarProducto
);

module.exports = router;
