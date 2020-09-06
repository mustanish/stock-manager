const { misc } = require('../utils');

const addProduct = (input) => {
  const { name, unit, details } = input;
  return {
    name: misc.ucwords(name),
    unit,
    details,
    createdAt: misc.dateNow(),
  };
};

const linkCategory = (from, tos) =>
  tos.map((to) => ({
    _from: `products/${from}`,
    _to: `productCategories/${to}`,
    createdAt: misc.dateNow(),
  }));

const linkManufacturer = (from, to) => ({
  _from: `products/${from}`,
  _to: `manufacturers/${to}`,
  createdAt: misc.dateNow(),
});

module.exports = {
  addProduct,
  linkCategory,
  linkManufacturer,
};
