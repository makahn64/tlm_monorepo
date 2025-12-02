import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBgB33jS84ih_PLTQ8IlOB15DrenSE2Ijk",
  authDomain: "tlm-2021-dev.firebaseapp.com",
  databaseURL: "https://tlm-2021-dev.firebaseio.com",
  projectId: "tlm-2021-dev",
  storageBucket: "tlm-2021-dev.firebasestorage.app",
  messagingSenderId: "534651940421",
  appId: "1:534651940421:web:6ddd73f4c672c95f123d2c",
  measurementId: "G-3TK6HEFQH9"
};

firebase.initializeApp(firebaseConfig);
console.log('Firebase is initialized');

export const auth = firebase.auth();
export const firestore = firebase.firestore();
