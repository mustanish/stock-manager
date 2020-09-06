const deepFreeze = require('deep-freeze');

const constant = {
  emailRegex: /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/,
  phoneRegex: /^([0]|\+91)?\d{10}(?:,([0]|\+91)?\d{10})*$/,
  otpDev: '000000',
  otpLength: 6,
  otpValidity: 600, // equivalent to 10 mins
  accessValidity: 3600, // equivalent to 1 hour
  refreshValidity: 604800, // equivalent to 7 days
  resetValidity: 600, // equivalent to 10 mins
  jwtsecret: `^hBlHu3pSCX@_KQ'JSX*6I*CX^brqM=@2nPIU*LSc~;LLwFG-Fk1-3F6WDT][5U`,
  smtpService: 'gmail',
  smtpEmail: 'azmiwilson@gmail.com',
  smtpPwd: 'saimakamar@123',
  templatePath: './templates',
  templateExt: '.html',
};

module.exports = deepFreeze(constant);
