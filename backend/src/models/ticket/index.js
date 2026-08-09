const crud = require('./crud');
const actions = require('./actions');
const queue = require('./queue');
const stats = require('./stats');
const patientLink = require('./patientLink');

module.exports = {
  ...crud,
  ...actions,
  ...queue,
  ...stats,
  ...patientLink,
};
