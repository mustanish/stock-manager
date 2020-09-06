const { misc } = require('../utils');

const addBillItem = (input) => {
  const {
    totalStock,
    quantityPerUnit,
    purchasePrice,
    sellingPrice,
    totalPrice,
    gst,
    expiryDate,
    batchNo,
    details,
  } = input;
  return {
    totalStock,
    quantityPerUnit,
    purchasePrice,
    sellingPrice,
    totalPrice,
    gst,
    expiryDate,
    batchNo,
    details,
    createdAt: misc.dateNow(),
  };
};

const linkProduct = (from, to) => ({
  _from: `products/${from}`,
  _to: `billItems/${to}`,
  createdAt: misc.dateNow(),
});

const linkSupplier = (from, to) => ({
  _from: `suppliers/${from}`,
  _to: `billItems/${to}`,
  createdAt: misc.dateNow(),
});

module.exports = {
  addBillItem,
  linkProduct,
  linkSupplier,
};
