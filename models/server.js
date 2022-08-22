const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      authPath: '/api/auth',
      buscarPath: '/api/buscar',
      categoriasPath: '/api/categorias',
      productosPath: '/api/productos',
      usersPath: '/api/users',
      uploadsPath: '/api/uploads',
    };

    // Conectar a DB
    this.conectarDb();

    // ? Middlewares
    this.middlewares();

    // ? Routes
    this.routes();
  }

  async conectarDb() {
    await dbConnection();
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del middleware
    this.app.use(express.json());

    // Directorio publico
    this.app.use(express.static('public'));

    // File upload
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.authPath, require('../routes/auth'));
    this.app.use(this.paths.buscarPath, require('../routes/buscar'));
    this.app.use(this.paths.categoriasPath, require('../routes/categorias'));
    this.app.use(this.paths.usersPath, require('../routes/users'));
    this.app.use(this.paths.productosPath, require('../routes/productos'));
    this.app.use(this.paths.uploadsPath, require('../routes/uploads'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`🚀 Servidor corriendo en el puerto ${this.port}`);
    });
  }
}

module.exports = Server;
