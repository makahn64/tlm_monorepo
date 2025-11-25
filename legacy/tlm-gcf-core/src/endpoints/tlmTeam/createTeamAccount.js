const { createNewAuth } = require('../../functions/authMethods');
const admin = require('firebase-admin');
const { INITIAL_TEAM_MEMBER_PASSWORD } = require('../../config/constants');

module.exports = async (req, res) => {
  const {firstName, lastName, email, isAdmin, isTrainer} = req.body;
  let {password} = req.body;

  if (!firstName || !lastName || !email) {
    return res.status(406).send('Missing param(s)');
  }

  if (!password) {
    password = INITIAL_TEAM_MEMBER_PASSWORD;
  }

  try {

    const newAuth = await createNewAuth({
      email,
      displayName: `${firstName} ${lastName}`,
      password
    });

    await admin.auth().setCustomUserClaims(newAuth.uid, {admin: !!isAdmin, trainer: !!isTrainer})

    await admin.firestore().collection('users').doc(newAuth.uid).set({
      firstName,
      lastName,
      uid: newAuth.uid,
      email: email,
      isTrainer,
      isAdmin
    });

    return res.status(200).send({uid: newAuth.uid});

  } catch (e) {
    return res.status(500).send(e.message);
  }
}
