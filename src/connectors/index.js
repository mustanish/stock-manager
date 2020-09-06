const { getStatusText, BAD_REQUEST, SERVICE_UNAVAILABLE } = require('http-status-codes');
const { Database, aql } = require('arangojs');
const { ApolloError } = require('apollo-server-express');
const { logger } = require('../utils');
const indexes = require('../constants/dbindex');
const {
  uniqueEmail,
  uniqueManufacturer,
  uniqueSupplier,
  uniqueProduct,
  unavailable,
} = require('../constants');

let db;
let col;

const OpenCollection = async (name, type) => {
  try {
    col = type === 'document' ? db.collection(name) : db.edgeCollection(name);
    const exist = await col.exists();
    if (!exist) {
      try {
        await col.create();
      } catch (error) {
        logger.error(`Unable to create collection, with following error ${error.message}`);
      }
    }
  } catch (error) {
    logger.error(`Unable to execute exists, with following error ${error.message}`);
  }
};

const CreateIndex = async (index) => {
  try {
    await OpenCollection(index.collection, index.collectionType);
    await col.createIndex(index);
  } catch (error) {
    logger.error(`Unable to create index ${index.name}, with following error ${error.message}`);
  }
};

const Initialize = async () => {
  db = new Database({ url: process.env.DATABASE_URL });
  db.useBasicAuth(process.env.DATABASE_USER, process.env.DATABASE_PASS);
  try {
    const result = await db.listDatabases();
    if (result.includes(process.env.DATABASE_NAME)) {
      db.useDatabase(process.env.DATABASE_NAME);
    } else {
      try {
        await db.createDatabase(process.env.DATABASE_NAME);
      } catch (error) {
        logger.error(`Unable to create database, with following error ${error.message}`);
      }
    }
  } catch (error) {
    logger.error(`Unable to execute listDatabases, with following error ${error.message}`);
  }
  // eslint-disable-next-line no-await-in-loop
  for (const index of indexes) await CreateIndex(index);
};

const CreateDocument = async (document, options) => {
  try {
    return await col.save(document, options);
  } catch (error) {
    if (error.message.includes('uniqueEmail')) {
      throw new ApolloError(uniqueEmail, getStatusText(BAD_REQUEST));
    }
    if (error.message.includes('uniqueManufacturer')) {
      throw new ApolloError(uniqueManufacturer, getStatusText(BAD_REQUEST));
    }
    if (error.message.includes('uniqueSupplier')) {
      throw new ApolloError(uniqueSupplier, getStatusText(BAD_REQUEST));
    }
    if (error.message.includes('uniqueProduct')) {
      throw new ApolloError(uniqueProduct, getStatusText(BAD_REQUEST));
    }
    logger.error(`Unable to create document, with following error ${error.message}`);
    throw new ApolloError(unavailable, getStatusText(SERVICE_UNAVAILABLE));
  }
};

const UpdateDocument = async (docKey, document, options) => {
  try {
    return await col.update(docKey, document, options);
  } catch (error) {
    if (error.message.includes('uniqueEmail')) {
      throw new ApolloError(uniqueEmail, getStatusText(BAD_REQUEST));
    }
    logger.error(`Unable to update document, with following error ${error.message}`);
    throw new ApolloError(unavailable, getStatusText(SERVICE_UNAVAILABLE));
  }
};

const RemoveDocument = async (docKey) => {
  try {
    await col.remove(docKey);
  } catch (error) {
    logger.error(`Unable to remove document, with following error ${error.message}`);
    throw new ApolloError(unavailable, getStatusText(SERVICE_UNAVAILABLE));
  }
};

const BulkInsert = async (documents, options) => {
  try {
    return await col.import(documents, options);
  } catch (error) {
    logger.error(`Unable to create document, with following error ${error.message}`);
    throw new ApolloError(unavailable, getStatusText(SERVICE_UNAVAILABLE));
  }
};

const Query = async (query) => {
  try {
    return await db.query(aql`${aql.literal(query)}`);
  } catch (error) {
    logger.error(`Unable to execute query, with following error ${error.message}`);
    throw new ApolloError(unavailable, getStatusText(SERVICE_UNAVAILABLE));
  }
};

module.exports = {
  Initialize,
  OpenCollection,
  CreateDocument,
  UpdateDocument,
  RemoveDocument,
  BulkInsert,
  Query,
};
