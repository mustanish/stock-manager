const { getStatusText, UNAUTHORIZED } = require('http-status-codes');
const { ApolloError } = require('apollo-server-express');
const { invalidToken, productMsg } = require('../constants');
const transformer = require('../transformers/Product');
const { misc } = require('../utils');

class Product {
  constructor(connector) {
    this.connector = connector;
  }

  async getVariants(args, context, info) {
    const query = `FOR v IN productVariants return {'name':v.name,'unit':v.unit}`;
    const cursor = await this.connector.Query(query);
    return cursor.all();
  }

  async getCategories(args, context, info) {
    const query = `FOR c IN productCategories return {'id':c._key,'name':c.name}`;
    const cursor = await this.connector.Query(query);
    return cursor.all();
  }

  async getProducts({ name }, context, info) {
    const query = `FOR m IN FULLTEXT(products, 'name', '${name}') LIMIT 5 RETURN {'id':m._key,'name':m.name}`;
    const cursor = await this.connector.Query(query);
    return cursor.all();
  }

  async addProduct({ input }, { me }, info) {
    if (!me) {
      throw new ApolloError(invalidToken, getStatusText(UNAUTHORIZED));
    }
    await this.connector.OpenCollection('products', 'document');
    const data = transformer.addProduct(input);
    const { _key } = await this.connector.CreateDocument(data);
    const linkManufacturer = transformer.linkManufacturer(_key, input.manufacturer);
    const linkCategory = transformer.linkCategory(_key, input.categories);
    await this.connector.OpenCollection('productRelations', 'edge');
    await this.connector.BulkInsert([...linkCategory, linkManufacturer], {
      onDuplicate: 'replace',
    });
    await this.connector.OpenCollection('userRelations', 'edge');
    const linkUser = misc.linkUser(`users/${me.ID}`, `products/${_key}`);
    this.connector.CreateDocument(linkUser, { overwrite: true });
    return {
      message: productMsg,
    };
  }
}

module.exports = Product;
