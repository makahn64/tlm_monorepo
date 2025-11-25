const admin = require('firebase-admin');
const axios = require('axios');

const RECAPTCHA_SECRET_KEY = '6LcGq5gaAAAAAAlsMuCMqlk-2FECNSBdDy618eg4';

module.exports = async (req, res) => {

  const lead = req.body;

  // verify recaptcha
  try {
    const recapResponse = await axios({
      method: 'post',
      url: 'https://www.google.com/recaptcha/api/siteverify',
      params: {
        secret: RECAPTCHA_SECRET_KEY,
        response: lead.contactInfo.recaptchaToken
      }
      });
    if (!recapResponse.data.success) {
      return res.status(403).send(recapResponse.data);
    }
  } catch (e) {
    return res.status(403).send(e.message);
  }

  try {
    await admin.firestore().collection('leads').add(lead);
    return res.status(200).send({
      message: 'recorded'
    });
  } catch (e) {
    return res.status(500).send(e.message);
  }
}
