/*********************************

 File:       firebaseClients.ts
 Function:   Firestore API for clients
 Copyright:  Bertco LLC
 Date:       9/26/20
 Author:     mkahn

 **********************************/

import {firestore} from "../../firebase/firebaseCore";
import {Client, Workout, WorkoutProgress, WorkoutStatus } from "tlm-common";
const clientCollection = firestore.collection('clients');

export async function getAllClients() {
  const clQuerySnapshot = await clientCollection.get();
  return clQuerySnapshot.docs.map(d => ({...d.data()}));
};

export async function getClient(docId: string) {
  const doc = await clientCollection.doc(docId).get();
  return {...doc.data()};
};

// export async function createNewClient( client: Partial<Client> ){
//   const newDoc = await clientCollection.add(client);
//   return newDoc.id;
// }

export async function modifyFields(uid: string, newFields: Partial<Client>) {
  // don't update the uid ever
  delete newFields.uid;
  return clientCollection.doc(uid).update(newFields);
}

export async function deleteClient(uid: string) {
  return clientCollection.doc(uid).delete();
}


export async function addWorkoutToClient(docId: string, workout: Workout) {
  return clientCollection.doc(docId).collection('workouts').add(workout);
}

export async function getAllWorkouts(docId: string) {
  const workouts = await clientCollection.doc(docId).collection('workouts').get();
  const workoutData: Workout[] = [];
  workouts.forEach(wo => workoutData.push({...wo.data(), id: wo.id} as Workout));
  return workoutData;
}

export async function getWorkout(docId: string, workoutId: string) {
  const workout = await clientCollection.doc(docId).collection('workouts').doc(workoutId).get();
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
