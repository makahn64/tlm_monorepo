const {updatePwd} = require('../../functions/authMethods');

module.exports = async (req, res) => {
  const uid = req.params.uid;
  if (!uid) {
    return res.status(406).send('Missing uid');
  }

  const {password} = req.body;
  if (!password) {
    return res.status(406).send('Missing pwd');
  }

  try {
    const response = await updatePwd(uid, password);
    return res.status(200).send(response);
  } catch (e) {
    return res.status(406).send(e.message);
  }
}
