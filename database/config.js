const mongoose = require('mongoose');

const dbConnection = async () => {
  await mongoose.connect(process.env.MONGODB_CNN);
  console.log('Base de datos online');
};

module.exports = {
  dbConnection,
};
