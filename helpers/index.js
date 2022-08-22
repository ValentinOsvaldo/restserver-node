const generarJWT = require('./generarJWT')
const dbValidators = require('./db-validators')
const subirArchivo = require('./subir-archivo')

module.exports = {
  ...generarJWT,
  ...dbValidators,
  ...subirArchivo,
}
