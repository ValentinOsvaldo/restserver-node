const { Router } = require('express');
const { check } = require('express-validator');

const {
  usersGet,
  usersPut,
  usersPost,
  usersDelete,
} = require('../controllers/users');
const {
  isValidRole,
  emailExist,
  existUserId,
} = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.get('/', usersGet);

router.put(
  '/:id',
  [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existUserId),
    check('role').custom(isValidRole),
    validarCampos,
  ],
  usersPut
);

router.post(
  '/',
  [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe de ser más de 6 letras').isLength({
      min: 6,
    }),
    check('email', 'El correo no es valido').isEmail(),
    check('email').custom(emailExist),
    // check('role', 'No es un rol permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
    check('role').custom(isValidRole),
    validarCampos,
  ],
  usersPost
);

router.delete(
  '/:id',
  [
    check('id', 'No es un ID valido').isMongoId(),
    check('id').custom(existUserId),
    validarCampos,
  ],
  usersDelete
);

module.exports = router;
