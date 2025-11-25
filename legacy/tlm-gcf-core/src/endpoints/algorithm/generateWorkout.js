const admin = require('firebase-admin');
const Algo = require('tlm-algo');

async function getAllExercises() {
  const querySnapshot = await admin.firestore().collection('exercises').get();
  return querySnapshot.docs.map(d => ({...d.data()}));
};

async function getAllWorkouts(clientId) {
  const workouts = await admin.firestore().collection('clients').doc(clientId).collection('workouts').get();
  const workoutData = [];
  workouts.forEach(wo => workoutData.push({...wo.data(), id: wo.id}));
  return workoutData;
}

module.exports = async (req, res) => {

  const {
    clientId,
    workoutType
  } = req.body;

  if (!clientId ) {
    return res.status(406).send('Shit be broke');
  }

  const clientDoc  = await admin.firestore().collection('clients').doc(clientId).get();
  const client = clientDoc.data();
  const allExercises = await getAllExercises();
  const pastWorkouts = await getAllWorkouts(clientId);
  const history = { pastWorkouts };
  const wo = Algo.workoutAssembler(workoutType || 0, {client, allExercises, history });
  return res.status(200).send(wo);

}
