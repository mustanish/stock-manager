const path = require('path');
const nodemailer = require('nodemailer');
const handlebars = require('nodemailer-express-handlebars');
const constant = require('../constants');
const logger = require('./logger');

const smtpTransport = nodemailer.createTransport({
  service: constant.smtpService,
  auth: {
    user: constant.smtpEmail,
    pass: constant.smtpPwd,
  },
});

const handlebarsOptions = {
  viewEngine: {
    extName: constant.templateExt,
    partialsDir: path.resolve(constant.templatePath),
    layoutsDir: path.resolve(constant.templatePath),
  },
  viewPath: path.resolve(constant.templatePath),
  extName: constant.templateExt,
};
smtpTransport.use('compile', handlebars(handlebarsOptions));

const prepare = (context, subject, template, to) => ({
  to,
  from: `Magadh Medico ${constant.smtpEmail}`,
  replyTo: constant.smtpEmail,
  subject,
  template,
  context,
});

const sendMail = async (context, subject, template, to) => {
  try {
    const args = prepare(context, subject, template, to);
    const { messageId } = await smtpTransport.sendMail(args);
    return messageId;
  } catch (error) {
    logger.error(`Unable to send email, with following error ${error.message}`);
  }
  return null;
};

module.exports.sendMail = sendMail;
