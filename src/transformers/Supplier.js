const { misc } = require('../utils');

const addSupplier = (input) => {
  const { name, address, phoneNumber, email, licenseNumber, gstNumber } = input;
  return {
    name: misc.ucwords(name),
    address,
    phoneNumber,
    email,
    licenseNumber,
    gstNumber,
    createdAt: misc.dateNow(),
  };
};

const linkManufacturer = (from, tos) =>
  tos.map((to) => ({
    _from: `suppliers/${from}`,
    _to: `manufacturers/${to}`,
    createdAt: misc.dateNow(),
  }));

module.exports = {
  addSupplier,
  linkManufacturer,
};
