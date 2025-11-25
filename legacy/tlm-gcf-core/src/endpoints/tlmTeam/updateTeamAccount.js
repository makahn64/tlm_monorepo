const {deleteAuth, createNewAuth, updateName, updateClaims, updatePwd} = require('../../functions/authMethods');
const admin = require('firebase-admin');
const { removeUndefineds } = require('../../functions/utils');

module.exports = async (req, res) => {

  const uid = req.params.uid;
  if (!uid) {
    return res.status(406).send('Missing uid');
  }

  const { isTrainer, isAdmin, firstName, lastName, email} = req.body;

  if (isTrainer!==undefined || isAdmin!==undefined) {
    // modify the claims on Firebase Auth
    // todo: add JWT middleware and then make sure the user is an admin
    try {
      await updateClaims(uid, { admin: !!isAdmin, trainer: !!isTrainer });
    } catch (e) {
      return res.status(500).send(e.message);
    }
  }

  if (firstName || lastName) {
    if (!(firstName && lastName)){
      return res.status(406).send('You must supply both first and last name');
    }
    // modify the name on Firebase Auth
    try {
      await updateName(uid, `${firstName} ${lastName}`);
    } catch (e) {
      return res.status(500).send(e.message);
    }
  }

  // Now update the Firestore entry...
  // can't send undefined's
  let modded = removeUndefineds({
    firstName, lastName, isTrainer, isAdmin, email
  });

  try {
    await admin.firestore().collection('users').doc(uid).update(modded);
    const user = await admin.firestore().collection('users').doc(uid).get();
    return res.status(200).send(user.data());
  } catch (e) {
    return res.status(500).send(e.message);
  }


  return res.status(500).send('bad code');
}
