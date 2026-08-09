const crudController = require('./crudController');
const callController = require('./callController');
const queueController = require('./queueController');
const statsController = require('./statsController');

module.exports = {
  ...crudController,
  ...callController,
  ...queueController,
  ...statsController,
};
