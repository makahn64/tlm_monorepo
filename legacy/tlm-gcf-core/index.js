const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const admin = require("firebase-admin");
const Aphrodite = require('./src/endpoints/tlmTeam');
const Client = require('./src/endpoints/clients');
const Policies = require('./src/policies');
const Onboarding = require('./src/endpoints/onboarding');
const Workouts = require('./src/endpoints/algorithm');
const getStats = require('./src/endpoints/stats/getStats');
const Storage = require('./src/endpoints/storage');
const Storage2022 = require('./src/endpoints/storage/fileOperationsNew')
const cors = require('cors');
const { setEnvironment, getEnvironment, getProjectServiceAccount } = require('./src/environment');

const VERSION = require('./package.json').version;
const PORT = 5555;

console.log(`Environment is: ${process.env.ENVIRONMENT || 'not set. If you want to run local: ENVIRONMENT=local node .'}`);
setEnvironment(process.env.ENVIRONMENT);
const env = getEnvironment();

admin.initializeApp({
  credential: admin.credential.cert(getProjectServiceAccount()),
  databaseURL: env.databaseUrl,
});

app.use(cors());
app.use(bodyParser.json());

if (process.env.ENVIRONMENT === 'local'){
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

app.use(Policies.addClaims);

// these are simple test methods
app.get('/ping', (req, res, next) => {
  res.json({ version: `${VERSION}`});
});

// app.get('/users/:userId', (req, res, next) => {
//   res.json({ id:req.params.userId});
// });

// Team accounts. Known as Users in the data model. For access to Aphrodite.
app.post('/team', Policies.isAdmin, Aphrodite.createAccount);
app.delete( '/team/:uid', Policies.isAdmin, Aphrodite.deleteAccount);
app.patch('/team/:uid', Policies.isAdmin, Aphrodite.updateAccount);
app.patch('/team/:uid/pwd', Policies.isAdminOrTrainer, Aphrodite.changePassword);

// Client accounts
app.post('/client', Policies.isAdminOrTrainer, Client.createAccount);
//app.post('/client', Client.createAccount);
app.delete('/client/:uid', Policies.isAdminOrTrainer, Client.deleteAccount);
app.patch('/client/:uid/pwd', Client.resetPassword);
app.patch('/client/:uid/email', Client.changeClientEmail);

// mobile client accounts
app.post('/mobileclient', Client.createMobileClientAccount);

// Workouts
app.post('/workout', Workouts.generateWorkout);

// Workouts
app.post('/journey/:clientId', Workouts.generateJourney);

// stats
app.get('/stats', getStats);

// leads
app.post('/leads', Onboarding.createLead);

// GCS
app.get('/surl', Storage.getSignedUrl);
app.get('/files', Storage.list);
app.get('/f', Storage2022.list);

module.exports = {
  app
};
