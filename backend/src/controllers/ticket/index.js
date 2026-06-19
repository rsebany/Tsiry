const crudController = require('./crudController');
const callController = require('./callController');
const queueController = require('./queueController');

module.exports = {
  ...crudController,
  ...callController,
  ...queueController,
};
