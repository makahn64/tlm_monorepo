/*********************************
 File:       firebaseUsers.ts
 Function:   Firestore API for portal users
 Copyright:  Bertco LLC
 Date:       9/26/20
 Author:     mkahn
 **********************************/

import {firestore} from "../../firebase/firebaseCore";
import {User} from "tlm-common";

const userCollection = firestore.collection('users');

export async function getAllUsers() {
  const clQuerySnapshot = await userCollection.get();
  return clQuerySnapshot.docs.map(d => ({...d.data()}));
};

export async function getUser(docId: string) {
  const doc = await userCollection.doc(docId).get();
  return {...doc.data()};
};

export async function modifyFields(uid: string, newFields: Partial<User>) {
  // don't update the uid ever
  delete newFields.uid;
  return userCollection.doc(uid).update(newFields);
}

export async function deleteUser(uid: string) {
  return userCollection.doc(uid).delete();
}
