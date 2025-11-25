/*********************************

 File:       firebaseClients.ts
 Function:   Firestore API for clients
 Copyright:  Bertco LLC
 Date:       9/26/20
 Author:     mkahn

 **********************************/

import {firestore, auth} from "../../firebase/firebaseCore";
import {Client, TrainerRecommendation, Workout, WorkoutProgress, WorkoutStatus, ClientMetadata} from 'tlm-common';
import {TrainerNote} from "../../../types/TrainerNote";
import { mapV0toV1 } from 'tlm-common';

const tidy = (obj: { [k:string]: any }) => {
  return Object.keys(obj).forEach(key => {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  });
}

const clientCollection = firestore.collection('clients');
const clientMetadataCollection = firestore.collection('clientMetadata');

export async function getAllClients() {
  const clQuerySnapshot = await clientCollection.get();
  return clQuerySnapshot.docs.map(d => ({...d.data()}));
};

export async function getClient(docId: string) {
  const doc = await clientCollection.doc(docId).get();
  return {...doc.data()};
};

export async function modifyFields(uid: string, newFields: Partial<Client>) {
  // don't update the uid ever
  delete newFields.uid;
  if (!newFields.mobilePhone){
    delete newFields.mobilePhone;
  }
  return clientCollection.doc(uid).update(newFields);
}

export async function addWorkoutToClient(clientId: string, workout: Workout) {
  return clientCollection.doc(clientId).collection('workouts').add(workout);
}

export async function updateClientWorkout(clientId: string, workout: Workout) {
  if (!workout.id) {
    throw new Error('Attempt to update workout for a client without workout ID');
  }
  return clientCollection.doc(clientId).collection('workouts').doc(workout.id).set(workout);
}

export async function getAllWorkouts(docId: string) {
  const workouts = await clientCollection.doc(docId).collection('workouts').get();
  const workoutData: Workout[] = [];
  workouts.forEach(wo => workoutData.push({...wo.data(), id: wo.id} as Workout));
  return workoutData;
}

export async function getWorkout(clientId: string, workoutId: string) {
  const workout = await clientCollection.doc(clientId).collection('workouts').doc(workoutId).get();
  return {...workout.data(), id: workoutId} as Workout;
}

export async function deleteWorkout(docId: string, workoutId: string) {
  return clientCollection.doc(docId).collection('workouts').doc(workoutId).delete();
}

function getWorkoutsCollection(clientId: string){
  return clientCollection.doc(clientId).collection('workouts');
}

export const markWorkoutComplete = async (clientId: string, workout: Workout) => {
  const uid = workout.id;
  const progress: WorkoutProgress = {
    status: WorkoutStatus.complete,
    exerciseIndex: 0,
    playbackTime: 0,
  };
  return getWorkoutsCollection(clientId)
    .doc(uid)
    .update({ progress, completedOn: new Date() });
};

export const markWorkoutProgress = async (
  clientId: string,
  workout: Partial<Workout>,
  index: number,
) => {
  const uid = workout.id;
  const progress: WorkoutProgress = {
    status: WorkoutStatus.inProgress,
    exerciseIndex: index,
    playbackTime: 0,
  };
  return getWorkoutsCollection(clientId).doc(uid).update({ progress });
};

// Recommendations

export async function addRecommendationToClient(clientId: string, recommendation: TrainerRecommendation) {
  if (!recommendation.media){
    delete recommendation.media;
  }
  return clientCollection.doc(clientId).collection('recommendations').add(recommendation);
}

export async function getAllRecommendations(clientId: string) {
  const recs = await clientCollection.doc(clientId).collection('recommendations').get();
  const recsData: TrainerRecommendation[] = [];
  recs.forEach(wo => recsData.push({...wo.data(), id: wo.id} as TrainerRecommendation));
  return recsData;
}

export async function getRecommendation(clientId: string, recId: string) {
  const rec = await clientCollection.doc(clientId).collection('recommendations').doc(recId).get();
  return {...rec.data(), id: recId} as Workout;
}

export async function deleteRecommendation(clientId: string, recId: string) {
  return clientCollection.doc(clientId).collection('recommendations').doc(recId).delete();
}

function getRecommendationsCollection(clientId: string){
  return clientCollection.doc(clientId).collection('recommendations');
}

// Notes

export async function addNoteToClient(clientId: string, note: string) {
  const u = auth.currentUser;
  const noteObj: Partial<TrainerNote> = {
    authorId: u?.uid,
    authorName: u?.displayName || 'TLM',
    createdOn: new Date(),
    note
  }
  return clientCollection.doc(clientId).collection('notes').add(noteObj);
}

export async function getAllNotes(clientId: string) {
  const notes = await clientCollection
    .doc(clientId)
    .collection('notes')
    .orderBy('createdOn', 'desc')
    .get();
  const notesData: TrainerNote[] = [];
  notes.forEach(n => notesData.push({...n.data(), id: n.id} as TrainerNote));
  return notesData;
}

export async function getNote(clientId: string, noteId: string) {
  const rec = await clientCollection.doc(clientId).collection('notes').doc(noteId).get();
  return {...rec.data(), id: noteId} as TrainerNote;
}

export async function deleteNote(clientId: string, noteId: string) {
  return clientCollection.doc(clientId).collection('notes').doc(noteId).delete();
}

function getNotesCollection(clientId: string){
  return clientCollection.doc(clientId).collection('notes');
}

export async function getClientMetadata(clientId: string): Promise<ClientMetadata | undefined> {
  const metadata = await clientMetadataCollection.doc(clientId).get();
  return metadata.data() as ClientMetadata;
}

export async function updateClientMetadata(clientId: string, metadata: ClientMetadata) {
  return clientMetadataCollection.doc(clientId).set(metadata, { merge: true });
}
