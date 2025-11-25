const { storage, BUCKET } = require('./bucketConstants');

const list = async (req, res) => {
  try {
    const files = await  storage.bucket(BUCKET).getFiles();
    const trimmed = files[0].map( f => f.metadata );
    const { prefix } = req.query;
    if (prefix) {
      const filtered = trimmed.filter( m => m.name.startsWith(prefix));
      return res.status(200).send(filtered.slice(0, 200));
    } else {
      return res.status(200).send(trimmed.slice(0, 200));
    }
  } catch (e) {
    return res.status(500).send(e.message);
  }
}


module.exports = {
  list
}
