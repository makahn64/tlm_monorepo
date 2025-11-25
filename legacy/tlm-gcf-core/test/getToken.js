const firebase = require("firebase/app");
require("firebase/auth");

const firebaseConfig = {
  apiKey: "AIzaSyCfiD-mCrjzmQEmbWiBFSqELIyTnCvPA10",
  authDomain: "tlm2021-41ce7.firebaseapp.com",
  databaseURL: "https://tlm2021-41ce7.firebaseio.com",
  projectId: "tlm2021-41ce7",
  storageBucket: "tlm2021-41ce7.appspot.com",
  messagingSenderId: "207697785725",
  appId: "1:207697785725:web:bbeface7fd7415e178d214",
  measurementId: "G-J4J76EMYQJ"
};

firebase.initializeApp(firebaseConfig);
console.log('Firebase is initialized');

const auth = firebase.auth();

(async() => {
  const {user} = await auth.signInWithEmailAndPassword('makahn64@gmail.com', 'Kumst33n00!!');
  const idToken = await user.getIdToken();
  console.log(idToken);
})();

