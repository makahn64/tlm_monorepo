const { storage, BUCKET } = require('./bucketConstants');

async function uploadToGCS({bucketName = BUCKET, filename}) {
  return await storage.bucket(bucketName)
    .upload(filename);
}

function expiry() {
  return new Date().getTime() + 10 * 60 * 1000;
}

module.exports = async (req, res) => {

  try {
    const bucket = storage.bucket(BUCKET);
    const file = bucket.file(`signedUrlTest.png`);
    const url = await file.getSignedUrl({ expires: expiry(), action: 'write', contentType: 'image/png' });
    return res.status(200).send(url);
  } catch (e) {
    return res.status(500).send(e.message);
  }
}
