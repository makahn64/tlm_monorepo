const admin = require('firebase-admin');
const bucketizeByStage = require('./functions/pregnancyStages');
const bucketizeByType = require('./functions/clientTypes');

module.exports = async (req, res) => {
  try {
    const clientsQS = await admin.firestore().collection('clients').get();
    const clients = clientsQS.docs.map(d => ({...d.data()}));
    const clientsByStage = bucketizeByStage(clients);
    const clientsByType = bucketizeByType(clients);
    return res.status(200).send({ clientsByStage, clientsByType });
  } catch (e) {
    return res.status(500).send(e.message);
  }
}
