

module.exports = async (req, res, next) => {

  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')){
    return res.status(403).send('forbidden');
  }

  const tarr = authHeader.split(' ');
  if (tarr.length!==2){
    return res.status(403).send('forbidden bad token');
  }

  const token = tarr[1];
  if (token==='0u812abacab'){
    return next();
  }

  return res.status(403).send('sorry');
}
