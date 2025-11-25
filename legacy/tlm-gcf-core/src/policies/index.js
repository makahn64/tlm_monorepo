const fakeJwt = require('./fakeJwt');
const addClaims = require('./firebaseClaims');
const isAdmin = require('./isAdmin');
const isAdminOrTrainer = require('./isAdminOrTrainer');

module.exports = {
  fakeJwt,
  addClaims,
  isAdmin,
  isAdminOrTrainer
}
