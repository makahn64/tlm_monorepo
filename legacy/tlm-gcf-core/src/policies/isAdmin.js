module.exports = (req, res, next) => {
  if (!req.claims || !req.claims.admin){
    return res.status(403).send('Yeah, not happening');
  }
  next();
}
