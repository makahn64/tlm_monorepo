import { FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection } from 'firebase/firestore';

let firebaseApp: FirebaseApp;
let db: Firestore;

export const setFirebaseAppInstance = (instance: FirebaseApp): void => {
  firebaseApp = instance;
  db = getFirestore(firebaseApp);
};

export const getCollection = (collectionName: string) => {
  return collection(db, collectionName);
};

export const getModel = (collectionName: string)
