const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (
  files,
  extensionesValidas = ['png', 'jpeg', 'jpg', 'gif'],
  carpeta = ''
) => {
  return new Promise((resolve, reject) => {
    const { archivo } = files;
    const shortName = archivo.name.split('.');
    const extension = shortName[shortName.length - 1];

    if (!extensionesValidas.includes(extension)) {
      return reject('Extensión no valida');
    }

    const nombreTemp = uuidv4() + '.' + extension;
    const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

    archivo.mv(uploadPath, (err) => {
      if (err) return reject(err);

      resolve(nombreTemp);
    });
  });
};

module.exports = { subirArchivo };
