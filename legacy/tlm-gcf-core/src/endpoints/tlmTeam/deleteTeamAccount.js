const {deleteAuth} = require('../../functions/authMethods');
const admin = require('firebase-admin');

module.exports = async (req, res) => {
  const {uid} = req.params;
  if (!uid) {
    return res.status(406).send('Missing uid');
  }
  try {
    // whack auth first
    await deleteAuth(uid);
    // now whack firestore
    await admin.firestore().collection('users').doc(uid).delete();
    return res.status(200).send('Team account deleted');
  } catch (e) {
    return res.status(500).send(e.message);
  }
}
