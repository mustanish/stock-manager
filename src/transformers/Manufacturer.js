const { misc } = require('../utils');

const addManufacturer = ({ name }) => ({
  name: misc.ucwords(name),
  createdAt: misc.dateNow(),
});

module.exports = {
  addManufacturer,
};
