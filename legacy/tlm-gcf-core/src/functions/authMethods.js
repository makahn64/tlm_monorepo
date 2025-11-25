const admin = require("firebase-admin");

const createNewAuth = async ({email, password, displayName}) => {
  return admin.auth().createUser({
    email,
    emailVerified: false,
    password,
    displayName
  });
};

const deleteAuth = async (uid) => {
  return admin.auth().deleteUser(uid);
}

const updatePwd = async (uid, newPwd) => {
  if (!newPwd || newPwd.length < 8) {
    throw new Error('Bad password: ' + newPwd);
  }
  return admin.auth().updateUser(uid, {  password: newPwd });
}

const updateName = async (uid, name) => {
  if (!name) {
    throw new Error('Name missing');
  }
  return admin.auth().updateUser(uid, {  displayName: name });
}

const updateClaims = async (uid, claims) => {
  if (!claims) {
    throw new Error('No claims');
  }
  return admin.auth().setCustomUserClaims(uid, claims);
}

const decodeToken = async (idToken) => admin.auth().verifyIdToken(idToken);

const getUser = async (uid) => admin.auth().getUser(uid);

const changeEmailAddress = async (uid, email) => admin.auth().updateUser(uid, {email});

module.exports = {
  createNewAuth,
  deleteAuth,
  updatePwd,
  updateName,
  updateClaims,
  decodeToken,
  getUser,
  changeEmailAddress
}
