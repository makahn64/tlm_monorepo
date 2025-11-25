const { updatePwd } = require('../../functions/authMethods');
const _ = require('lodash');

const WORD1 = [ 'DREAMING', 'WALKING', 'HAPPY', 'JUMPING', 'NAPPING', 'SMILING'];
const WORD2 = [ 'BUNNY', 'PUPPY', 'KITTEN', 'PANDA', 'HAMSTER', 'BIRDIE'];

module.exports = async (req, res) => {

  const {uid} = req.params;
  if (!uid) {
    return res.status(406).send('UID not provided');
  }

  // whack auth first
  try {
    const newPwd = `TLM-${_.sample(WORD1)}-${_.sample(WORD2)}`;
    await updatePwd(uid, newPwd);
    return res.status(200).send(newPwd);
  } catch (e) {
    // swallow the error for now
    console.error('Failure reset pwd for a client');
    console.error(e.message);
    return res.status(500).send(e.message);
  }

}
