const { storage2022, MEDIA_BUCKET_2022 } = require('./bucketConstants');

const list = async (req, res) => {
  try {
    const files = await  storage2022.bucket(MEDIA_BUCKET_2022).getFiles();
    const trimmed = files[0].map( f => f.metadata );
    const { folder } = req.query;
    if (folder) {
      const filtered = trimmed.filter( m => ( m.name.startsWith(`${folder}/`) && m.name!==`${folder}/`)) ;
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
