/*********************************

 File:       firebaseExercises.ts
 Function:   Firestore getter for all exercises
 Copyright:  Bertco LLC
 Date:       9/26/20
 Author:     mkahn

 **********************************/

import {firestore} from "../../firebase/firebaseCore";
import {Exercise} from "tlm-common";

const exerciseCollection = firestore.collection('exercises');

export async function getAllExercises() {
  const exQuerySnapshot = await exerciseCollection.get();
  return exQuerySnapshot.docs.map(d => ({...d.data(), docId: d.id }));
}

export async function getExercise(docId: string) {
  const doc = await exerciseCollection.doc(docId).get();
  return {...doc.data(), docId: doc.data()?.id };
}

export async function createNewExercise( exercise: Partial<Exercise> ){
  const newDoc = await exerciseCollection.add(exercise);
  return newDoc.id;
}

export async function modifyFields( docId: string, newFields: Partial<Exercise>){
  delete newFields.docId;
  return exerciseCollection.doc(docId).update(newFields);
}

export async function deleteExercise( docId: string ){
  return exerciseCollection.doc(docId).delete();
}
