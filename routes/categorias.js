const { Router } = require('express');
const { check } = require('express-validator');
const {
  crearCategoria,
  obtenerCategorias,
  obtenerCategoria,
  actualizarCategoria,
  borrarCategoria,
} = require('../controllers/categorias');
const { existCategoryId } = require('../helpers/db-validators');

const { validarCampos, validarJWT, isAdminRol } = require('../middlewares');

const router = Router();

router.get('/', obtenerCategorias);

router.get(
  '/:id',
  [
    check('id', 'No es un ID de Mongo').isMongoId(),
    check('id').custom(existCategoryId),
    validarCampos,
  ],
  obtenerCategoria
);

router.post(
  '/',
  [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

// todo: Actualizar - privado - cualquier con token valido
router.put(
  '/:id',
  [
    validarJWT,
    check('id', 'No es un ID de Mongo').isMongoId(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existCategoryId),
    validarCampos,
  ],
  actualizarCategoria
);

// todo: borrar una categoria - admin
router.delete(
  '/:id',
  [
    validarJWT,
    isAdminRol,
    check('id', 'No es un ID de Mongo').isMongoId(),
    check('id').custom(existCategoryId),
    validarCampos,
  ],
  borrarCategoria
);

module.exports = router;
