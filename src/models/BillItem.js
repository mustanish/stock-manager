const { getStatusText, UNAUTHORIZED } = require('http-status-codes');
const { ApolloError } = require('apollo-server-express');
const { invalidToken, productMsg } = require('../constants');
const transformer = require('../transformers/BillItem');
const { billItem } = require('../schemas');
const { misc } = require('../utils');

class BillItem {
  constructor(connector) {
    this.connector = connector;
  }

  async getBillItems({ name }, { me }, info) {
    if (!me) {
      throw new ApolloError(invalidToken, getStatusText(UNAUTHORIZED));
    }
    const query = `FOR m IN FULLTEXT(manufacturers, 'name', '${name}') LIMIT 5 RETURN {'id':m._key,'name':m.name}`;
    const cursor = await this.connector.Query(query);
    return cursor.all();
  }

  async addBillItem({ input }, { me }, info) {
    if (!me) {
      throw new ApolloError(invalidToken, getStatusText(UNAUTHORIZED));
    }
    misc.validator(input, billItem);
    await this.connector.OpenCollection('billItems', 'document');
    const data = transformer.addBillItem(input);
    const { _key } = await this.connector.CreateDocument(data);
    await this.connector.OpenCollection('productRelations', 'edge');
    const linkProduct = transformer.linkProduct(input.product, _key);
    this.connector.CreateDocument(linkProduct, { overwrite: true });
    await this.connector.OpenCollection('supplierRelations', 'edge');
    const linkSupplier = transformer.linkSupplier(input.supplier, _key);
    this.connector.CreateDocument(linkSupplier, { overwrite: true });
    await this.connector.OpenCollection('userRelations', 'edge');
    const linkUser = misc.linkUser(`users/${me.ID}`, `billItems/${_key}`);
    this.connector.CreateDocument(linkUser, { overwrite: true });
    return {
      message: productMsg,
    };
  }
}

module.exports = BillItem;
