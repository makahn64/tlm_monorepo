const deleteAccount = require('./deleteClientAccount');
const createAccount = require('./createClientAccount');
const resetPassword = require('./resetClientPassword');
const createMobileClientAccount = require('./createMobileClientAccount');
const changeClientEmail = require('./changeClientEmail');

// Update and read are handled through the Firestore API

module.exports = {
  deleteAccount,
  createAccount,
  resetPassword,
  createMobileClientAccount,
  changeClientEmail
}
