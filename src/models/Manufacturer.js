const { getStatusText, UNAUTHORIZED } = require('http-status-codes');
const { ApolloError } = require('apollo-server-express');
const { invalidToken, manufacturerMsg } = require('../constants');
const transformer = require('../transformers/Manufacturer');
const { misc } = require('../utils');

class Supplier {
  constructor(connector) {
    this.connector = connector;
  }

  async getManufacturers({ name }, { me }, info) {
    if (!me) {
      throw new ApolloError(invalidToken, getStatusText(UNAUTHORIZED));
    }
    const query = `FOR m IN FULLTEXT(manufacturers, 'name', '${name}') LIMIT 5 RETURN {'id':m._key,'name':m.name}`;
    const cursor = await this.connector.Query(query);
    return cursor.all();
  }

  async addManufacturer(args, { me }, info) {
    if (!me) {
      throw new ApolloError(invalidToken, getStatusText(UNAUTHORIZED));
    }
    await this.connector.OpenCollection('manufacturers', 'document');
    const data = transformer.addManufacturer(args);
    const { _key } = await this.connector.CreateDocument(data);
    await this.connector.OpenCollection('userRelations', 'edge');
    const linkUser = misc.linkUser(`users/${me.ID}`, `manufacturers/${_key}`);
    this.connector.CreateDocument(linkUser, { overwrite: true });
    return {
      message: manufacturerMsg,
    };
  }
}

module.exports = Supplier;
