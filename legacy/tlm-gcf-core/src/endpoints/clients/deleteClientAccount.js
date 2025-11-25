const {deleteAuth} = require('../../functions/authMethods');
const admin = require('firebase-admin');

module.exports = async (req, res) => {
  const {uid} = req.params;
  if (!uid) {
    return res.status(406).send('UID not provided');
  }

    // whack auth first
  try {
    await deleteAuth(uid);
  } catch (e) {
    // swallow the error for now
    console.error('Failure deleting auth for a client');
    console.error(e.message);
  }

  try {
    // now whack firestore
    await admin.firestore().collection('clients').doc(uid).delete();
    return res.status(200).send('Client deleted');
  } catch (e) {
    return res.status(500).send(e.message);
  }
}
