const { changeEmailAddress } = require('../../functions/authMethods');

module.exports = async (req, res) => {

  const {uid} = req.params;
  const { email } = req.body;

  if (!uid || !email) {
    return res.status(406).send('UID or email not provided');
  }

  try {
    await changeEmailAddress(uid, email);
    return res.status(200).send({ newEmail: email});
  } catch (e) {
    console.error('Failure change email for a client');
    console.error(e.message);
    return res.status(500).send(e.message);
  }

}
