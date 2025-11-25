module.exports = (req, res, next) => {
  const { claims } = req;
  if (!req.claims){
    return res.status(403).send('Yeah, not happening');
  }

  const { trainer, admin } = claims;
  if (trainer || admin) {
    next();
  } else {
    return res.status(403).send('Bad claim');
  }
}
