const deepFreeze = require('deep-freeze');

const constant = {
  invalidReq: `Invalid request, Please review your request and try again`,
  invalidEmail: `Sorry, We cannot find an account with that email`,
  uniqueEmail: `Sorry, a user with this email already exist`,
  invalidPwd: `Wrong password, Please re-enter`,
  otpMsg: `One Time Password (OTP) has been sent to your email`,
  otpReq: `Enter the OTP received on your email`,
  otpMaxLen: `Sorry that is not a valid OTP, must have a length of 6`,
  invalidOtp: `Wrong or expired OTP, Please re-enter`,
  invalidToken: `Sorry either the token has expired or it is invalid`,
  verifyMsg: `Thank you for verifying your email address`,
  logoutMsg: `You have been successfully logged out`,
  notFoundResource: `The reuested resource was not found`,
  unavailable: `Unable to service your request. Please try again later`,
  resetMsg: `Your password has been reset`,
  manufacturerMsg: `Manufacturer was successfully added`,
  supplierMsg: `supplier was successfully added`,
  productMsg: `Product was successfully added`,
  uniqueManufacturer: `Sorry, a manufacturer with this name already exist`,
  uniqueProduct: `Sorry, a product with this name already exist`,
};

module.exports = deepFreeze(constant);
