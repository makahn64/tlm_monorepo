const admin = require('firebase-admin');

let hasWeights = false;

function weeksBetween(d1, d2) {
  return Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1000));
}

async function getJourneyByTag(tag) {

  const fullTag = `${tag}-${hasWeights ? 'WTS' : 'BND' }`;

  const journeySnapshot = await admin.firestore()
    .collection('journeys')
    .where("tag", "==", fullTag)
    .get();

  if (journeySnapshot.empty) {
    console.log(`No journey for ${fullTag}`);
    throw new Error(`no such journey: ${fullTag}`)
  }

  const data = journeySnapshot.docs[0].data();
  const docId = journeySnapshot.docs[0].id;
  return {...data, docId };
}

function generatePregnantJourney(client) {
  // 1 Shooting pelvic pain => SPD workout
  if (client.injuries.includes('pubicPain')) {
    return getJourneyByTag('PRE-SPD', client.equipment)
  }
  // 2 Groin pull pain => PGP
  if (client.injuries.includes('groinPain')) {
    return getJourneyByTag('PRE-PGP')
  }
  // 3 general pelvic pain (sacrum?) => SPD
  if (client.injuries.includes('groinPain')) {
    return getJourneyByTag('PRE-SPD')
  }
  // 4 Sciatica => SPD
  if (client.sciatica && client.sciatica!=='none'){
    return getJourneyByTag('PRE-SPD')
  }
  // 5 prolapse or incontinence => incontenence/prolapse "ICJ"
  if (client.injuries.includes('leakage') || client.injuries.includes('prolapse') ){
    return getJourneyByTag('PRE-ICP')
  }
  // 6 hypertonic => HYP
  if (client.injuries.includes('hypertonic') ){
    return getJourneyByTag('PRE-HYP')
  }
  // 7 DR => DRC
  if (client.injuries.includes('dr') ){
    return getJourneyByTag('PRE-DRC')
  }
  // 8 Back pain => BKP
  if (client.backPain !== 'none' ){
    return getJourneyByTag('PRE-BKP')
  }
  // 9, 10, 11 Goals
  // 9 labor prep
  if (client.goals && client.goals.includes('labor-prep')){
    return getJourneyByTag('PRE-LBP')
  }
  // 10 strength => Feel Good
  if (client.goals && client.goals.includes('strength')){
    return getJourneyByTag('PRE-FGD')
  }
  // 11 DR...same workout as above
  if (client.goals && client.goals.includes('dr-pelvic')){
    return getJourneyByTag('PRE-DRC')
  }

  console.warn(`Did not match a journey for pre client ${client.uid}`);
  return getJourneyByTag('PRE-FGD')

}

// FIXME: add the bands vs weights
function generatePostpartumJourney(client) {
  // 1 prolapse or incontinence => SUI/prolapse workout
  if (client.injuries.includes('leakage') || client.injuries.includes('prolapse') ){
    return getJourneyByTag('POST-SUI')
  }
  // 2 hypertonic => HYP
  if (client.injuries.includes('hypertonic') ){
    return getJourneyByTag('POST-HYP')
  }
  // 3 DR
  if (client.injuries.includes('dr') ){
    return getJourneyByTag('POST-DRC')
  }
  // 4 Back pain => BKP
  if (client.backPain !== 'none' ){
    return getJourneyByTag('POST-BKP')
  }
  // 5 < 6 weeks post partum 6 week workout
  const weeksSince = weeksBetween(new Date(), new Date(client.dueDate));
  if (weeksSince<=6) {
    return getJourneyByTag('POST-6WW')
  }
  // 6, 7, 8, 9 Goals
  // 6 fitness
  if (client.goals && client.goals.includes('pp-fitness')){
    return getJourneyByTag('POST-FGD')
  }
  // 7 DR...same workout as above, uh there's a lot of DR in here!
  if (client.goals && client.goals.includes('pp-dr')){
    return getJourneyByTag('POST-DRC')
  }
  // 8 Pelvic Floor
  if (client.goals && client.goals.includes('pp-pelvic')){
    return getJourneyByTag('POST-SUI')
  }
  // 10 strength => Feel Good
  if (client.goals && client.goals.includes('pp-recovery')){
    return getJourneyByTag('POST-6WW')
  }

  if (client.goals && client.goals.includes('pp-csection')){
    return getJourneyByTag('POST-CSC')
  }

  console.warn(`Did not match a journey for post client ${client.uid}`);
  return getJourneyByTag('POST-FGD')

}

function generateTTCJourney(client) {
  return getJourneyByTag('TTC');
}

async function generateJourney(client) {

  hasWeights = client.equipment.some( (eq) => eq.includes('bell'));

  if (client.isPregnant) {
    return generatePregnantJourney(client);
  }

  if (client.tryingToConceive) {
    return generateTTCJourney(client);
  }

  return generatePostpartumJourney(client);
}


module.exports = async (req, res) => {

  const { clientId } = req.params;

  if (!clientId ) {
    return res.status(406).send('Client ID missing');
  }

  const clientDoc  = await admin.firestore().collection('clients').doc(clientId).get();
  const client = clientDoc.data();
  if (!client) {
    return res.status(404).send('No such client ID');
  }

  console.log(`Client is ${client.email}`);

  const journeys = (client.journeys || []);

  try {
    const newJ = await generateJourney(client);
    console.log(`Journey is ${JSON.stringify(newJ)}`);
    journeys.push(newJ);
  } catch (err) {
    return res.status(406).send(err.message);
  }

  try {
    await admin.firestore().collection('clients').doc(clientId).update({ journeys });
  } catch (err) {
    return res.status(500).send(err.message);
  }

  console.log(`Sending journey ${journeys}`);
  return res.status(200).send(journeys);

}
