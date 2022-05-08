const { Router } = require('express');
const { check } = require('express-validator')

const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

// todo: obtener todas las categorias - public
router.get('/', (req, res) => {
  res.json('get')
})

// todo: obtener una categoria - public
router.get('/:id', (req, res) => {
  res.json('get - id')
})

// todo: Crear categoria - privado - cualquier persona con un token valido

router.post('/', (req, res) => {
  res.json('post')
})

// todo: Actualizar - privado - cualquier con token valido 
router.put('/:id', (req, res) => {
  res.json('put')
})

// todo: borrar una categoria - admin
router.delete('/:id', (req, res) => {
  res.json('delete')
})

module.exports = router;
