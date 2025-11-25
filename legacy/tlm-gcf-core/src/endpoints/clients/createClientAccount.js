const { createNewAuth, updateClaims } = require('../../functions/authMethods');
const admin = require('firebase-admin');
const { addTimestamps } = require('../../functions/utils');

module.exports = async (req, res) => {

  const {
    firstName,
    lastName,
    email,
    clientType = 0, // 'active'
    password = 'TLM1234',
    mobilePhone = ''
  } = req.body;

  if (!firstName || !lastName || !email) {
    return res.status(406).send('Missing param(s)');
  }

  try {
    const newAuth = await createNewAuth({
      email,
      displayName: `${firstName} ${lastName}`,
      password
    });
    await updateClaims(newAuth.uid, {client: true});
    const seconds = Math.round(Date.now()/1000);
    await admin.firestore().collection('clients').doc(newAuth.uid).set({
      firstName,
      lastName,
      uid: newAuth.uid,
      email: email,
      clientType,
      mobilePhone,
      createdAt: new admin.firestore.Timestamp(seconds, 0)
    });

    return res.status(200).send({uid: newAuth.uid});

  } catch (e) {
    return res.status(500).send(e.message);
  }
}
