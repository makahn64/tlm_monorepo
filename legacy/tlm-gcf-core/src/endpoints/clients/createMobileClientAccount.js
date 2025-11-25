const {createNewAuth, updateClaims, getUser} = require('../../functions/authMethods');
const admin = require('firebase-admin');
const {addTimestamps} = require('../../functions/utils');

module.exports = async (req, res) => {

  const {uid} = req.body;

  if (!uid) {
    return res.status(406).send('Missing id');
  }

  const clientRef = admin.firestore().collection('clients').doc(uid);

  try {
    // check if account already exists
    const clientSnap = await clientRef.get();
    if (clientSnap.exists) {
      return res.status(200).send({clientState: 'exists'});
    } else {
      // new client
      // set claims
      await updateClaims(uid, {client: true});
      // grab user info for Client doc
      const user = await getUser(uid);
      const {displayName, email} = user;
      const names = displayName.split(' ');
      let firstName = '';
      let lastName = '';
      if (names.length === 2) {
        firstName = names[0];
        lastName = names[1];
      }
      const seconds = Math.round(Date.now() / 1000);
      await admin.firestore().collection('clients').doc(uid).set({
        firstName,
        lastName,
        displayName,
        uid,
        email: email || '',
        // TS enum basic mobile sub is a 6
        clientType: 6,
        createdAt: new admin.firestore.Timestamp(seconds, 0),
        injuries: [],
        postureConditions: [],
        equipment: [],
        activeAccount: true,
        fitnessLevel: 'unknown',
        isPregnant: true,
        backPain: 'none',
        sciatica: 'none',
      });
      return res.status(200).send({clientState: 'created'});
    }
  } catch (e) {
    return res.status(500).send(e.message);
  }
}
