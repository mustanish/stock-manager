const { getStatusText, UNAUTHORIZED } = require('http-status-codes');
const { ApolloError } = require('apollo-server-express');
const { invalidToken, supplierMsg } = require('../constants');
const transformer = require('../transformers/Supplier');
const { supplier } = require('../schemas');
const { misc } = require('../utils');

class Supplier {
  constructor(connector) {
    this.connector = connector;
  }

  async getSuppliers({ name }, { me }, info) {
    if (!me) {
      throw new ApolloError(invalidToken, getStatusText(UNAUTHORIZED));
    }
    const query = `FOR s IN FULLTEXT(suppliers, 'name', '${name}') LIMIT 5 return {'id':s._key,'name':s.name,'address':s.address, 'phoneNumber':s.phoneNumber,'email':s.email,'licenseNumber':s.licenseNumber,'gstNumber':
    s.gstNumber,manufacturers:s.manufacturers}`;
    const cursor = await this.connector.Query(query);
    return cursor.all();
  }

  async addSupplier({ input }, { me }, info) {
    if (!me) {
      throw new ApolloError(invalidToken, getStatusText(UNAUTHORIZED));
    }
    misc.validator(input, supplier);
    await this.connector.OpenCollection('suppliers', 'document');
    const data = transformer.addSupplier(input);
    const { _key } = await this.connector.CreateDocument(data);
    const linkData = transformer.linkManufacturer(_key, input.manufacturers);
    await this.connector.OpenCollection('supplierRelations', 'edge');
    await this.connector.BulkInsert(linkData, { onDuplicate: 'replace' });
    await this.connector.OpenCollection('userRelations', 'edge');
    const linkUser = misc.linkUser(`users/${me.ID}`, `suppliers/${_key}`);
    this.connector.CreateDocument(linkUser, { overwrite: true });
    return {
      message: supplierMsg,
    };
  }
}

module.exports = Supplier;
