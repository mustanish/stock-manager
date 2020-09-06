/* eslint-disable global-require */
const connector = require('../connectors');
const User = new (require('./User'))(connector);
const Product = new (require('./Product'))(connector);
const Supplier = new (require('./Supplier'))(connector);
const Manufacturer = new (require('./Manufacturer'))(connector);
const BillItem = new (require('./BillItem'))(connector);

module.exports = {
  User,
  Product,
  Supplier,
  Manufacturer,
  BillItem,
};
