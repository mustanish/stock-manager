const { ApolloError } = require('apollo-server-express');
const { getStatusText, BAD_REQUEST, UNAUTHORIZED } = require('http-status-codes');
const { token, smtp, misc } = require('../utils');
const transformer = require('../transformers/User');
const {
  accessValidity,
  refreshValidity,
  otpLength,
  otpValidity,
  otpMsg,
  verifyMsg,
  resetValidity,
  invalidEmail,
  invalidToken,
  resetMsg,
  logoutMsg,
} = require('../constants');
const { register, login, forgot, verify, reset } = require('../schemas');

class User {
  constructor(connector) {
    this.connector = connector;
  }

  async register(args, context, info) {
    misc.validator(args, register);
    await this.connector.OpenCollection('users', 'document');
    const data = transformer.register(args);
    const options = { returnNew: true };
    const {
      new: { _key, name, email },
    } = await this.connector.CreateDocument(data, options);
    const accessToken = this.generateToken(_key, 'accessToken', accessValidity);
    const refreshToken = this.generateToken(_key, 'refreshToken', refreshValidity);
    return {
      token: {
        accessToken: { value: accessToken, expiresIn: accessValidity },
        refreshToken: { value: refreshToken, expiresIn: refreshValidity },
      },
      user: { id: _key, name, email },
    };
  }

  async login(args, context, info) {
    misc.validator(args, login);
    await this.connector.OpenCollection('users', 'document');
    const { docKey, password, name, email } = await this.exist(args.email);
    const data = transformer.login(args, password);
    this.connector.UpdateDocument(docKey, data);
    const accessToken = this.generateToken(docKey, 'accessToken', accessValidity);
    const refreshToken = this.generateToken(docKey, 'refreshToken', refreshValidity);
    return {
      token: {
        accessToken: { value: accessToken, expiresIn: accessValidity },
        refreshToken: { value: refreshToken, expiresIn: refreshValidity },
      },
      user: { id: docKey, name, email },
    };
  }

  async forgot(args, context, info) {
    misc.validator(args, forgot);
    await this.connector.OpenCollection('users', 'document');
    const { docKey, name } = await this.exist(args.email);
    const otp = misc.generateOTP(otpLength);
    const subject = 'Password help has arrived!';
    const content = { name, otp };
    smtp.sendMail(content, subject, 'forgot', args.email);
    const data = transformer.forgot(otp, otpValidity);
    await this.connector.UpdateDocument(docKey, data);
    const accessToken = this.generateToken(docKey, 'tempToken', otpValidity);
    return {
      token: { value: accessToken, expiresIn: otpValidity },
      message: otpMsg,
    };
  }

  async verify(args, { me }, info) {
    if (!me) {
      throw new ApolloError(invalidToken, getStatusText(UNAUTHORIZED));
    }
    misc.validator(args, verify);
    await this.connector.OpenCollection('users', 'document');
    const { ID, tokenID } = me;
    const user = await this.exist(ID);
    const data = transformer.verify(args, user);
    const options = { keepNull: false };
    this.connector.UpdateDocument(ID, data, options);
    this.removeToken(tokenID);
    const accessToken = this.generateToken(ID, 'tempToken', resetValidity);
    return {
      token: { value: accessToken, expiresIn: resetValidity },
      message: verifyMsg,
    };
  }

  async reset(args, { me }, info) {
    if (!me) {
      throw new ApolloError(invalidToken, getStatusText(UNAUTHORIZED));
    }
    misc.validator(args, reset);
    await this.connector.OpenCollection('users', 'document');
    const { ID, tokenID } = me;
    const { docKey } = await this.exist(ID);
    const data = transformer.reset(args);
    await this.connector.UpdateDocument(docKey, data);
    this.removeToken(tokenID);
    return {
      message: resetMsg,
    };
  }

  async refresh(args, { me }, info) {
    if (!me) {
      throw new ApolloError(invalidToken, getStatusText(UNAUTHORIZED));
    }
    const { ID, tokenID } = me;
    const { docKey } = await this.exist(ID);
    this.removeToken(tokenID);
    const accessToken = this.generateToken(docKey, 'accessToken', accessValidity);
    const refreshToken = this.generateToken(docKey, 'refreshToken', refreshValidity);
    return {
      accessToken: { value: accessToken, expiresIn: accessValidity },
      refreshToken: { value: refreshToken, expiresIn: refreshValidity },
    };
  }

  logout(args, { me }, info) {
    if (!me) {
      throw new ApolloError(invalidToken, getStatusText(UNAUTHORIZED));
    }
    const { tokenID } = me;
    this.removeToken(tokenID);
    return {
      message: logoutMsg,
    };
  }

  async profile(args, { me }, info) {
    if (!me) {
      throw new ApolloError(invalidToken, getStatusText(UNAUTHORIZED));
    }
    const { docKey, name, email } = await this.exist(args.id);
    return { id: docKey, name, email };
  }

  async exist(identity) {
    const query = `FOR u IN users FILTER u.email == "${identity}" || u._key == "${identity}" return {'name':u.name,'email':u.email,'password':u.password,'otp':u.otp,'otpValidity':u.otpValidity,'docKey':u._key}`;
    const cursor = await this.connector.Query(query);
    if (!cursor.hasNext()) {
      throw new ApolloError(invalidEmail, getStatusText(BAD_REQUEST));
    }
    return cursor.next();
  }

  async generateToken(docKey, tokenType, validity) {
    await this.connector.OpenCollection('tokens', 'document');
    const { tokenString, tokenID, tokenExpires } = token.generateToken(docKey, validity, tokenType);
    const data = transformer.generateToken(tokenID, tokenType, tokenExpires);
    this.connector.CreateDocument(data);
    return tokenString;
  }

  async checkToken(docKey) {
    const query = `FOR t IN tokens FILTER t._key == "${docKey}" return t`;
    const cursor = await this.connector.Query(query);
    return cursor.hasNext();
  }

  async removeToken(tokenID) {
    await this.connector.OpenCollection('tokens', 'document');
    this.connector.RemoveDocument(tokenID);
  }
}

module.exports = User;
