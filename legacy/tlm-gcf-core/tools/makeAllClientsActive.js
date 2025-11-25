const admin = require('firebase-admin');
const service_account = require('../src/environment/serviceAccounts/service-account.json');

admin.initializeApp({
  credential: admin.credential.cert(service_account),
  databaseURL: "https://tlmaphrodite.firebaseio.com",
});

(async ()=>{
  const clientCollection = admin.firestore().collection('clients');
  const cqs = await clientCollection.get();
  console.log(`Clients: ${cqs.size}`);

  const batch = admin.firestore().batch();
  // make them leads
  cqs.forEach( d => batch.update(d.ref, {clientType: 3}));
  await batch.commit();

})();
