const crud = require('./crud');
const actions = require('./actions');
const queue = require('./queue');

module.exports = {
  ...crud,
  ...actions,
  ...queue,
};
