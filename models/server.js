const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {
  constructor() {
    this.app       = express();
    this.port      = process.env.PORT;

    this.paths = {
      authPath      : '/api/auth',
      categoriasPath: '/api/categorias',
      usersPath     : '/api/users',
    }


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
  }

  routes() {
    this.app.use(this.paths.authPath, require('../routes/auth'));
    this.app.use(this.paths.categoriasPath, require('../routes/categorias'));
    this.app.use(this.paths.usersPath, require('../routes/users'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Example app listening on port ${this.port}`);
    });
  }
}

module.exports = Server;
