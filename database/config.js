const mongoose = require('mongoose');

const dbConnection = async () => {
  await mongoose.connect(process.env.MONGODB_CNN);
};

module.exports = {
  dbConnection,
};
