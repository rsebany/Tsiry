const crud = require('./crud');
const actions = require('./actions');
const queue = require('./queue');
const patientLink = require('./patientLink');

module.exports = {
  ...crud,
  ...actions,
  ...queue,
  ...patientLink,
};
