const crud = require('./crud');
const actions = require('./actions');
const queue = require('./queue');
const stats = require('./stats');

module.exports = {
  ...crud,
  ...actions,
  ...queue,
  ...stats,
};
