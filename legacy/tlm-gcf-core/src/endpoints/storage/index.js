const getSignedUrl = require('./getSignedPutUrl');
const fileOps = require('./fileOperations');

module.exports = {
  getSignedUrl,
  ...fileOps
}
