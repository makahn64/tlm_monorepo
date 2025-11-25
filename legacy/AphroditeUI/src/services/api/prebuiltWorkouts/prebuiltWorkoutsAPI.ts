import {firestore, auth} from "../../firebase/firebaseCore";
import { PrebuiltWorkout } from 'tlm-common';

const tidy = (obj: { [k:string]: any }) => {
  return Object.keys(obj).forEach(key => {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  });
}

const workoutCollection = firestore.collection('prebuiltWorkouts');

export async function getAll() {
  const querySnapshot = await workoutCollection.get();
  return querySnapshot.docs.map(d => ({...d.data(), id: d.id}));
};

export async function getWorkout(id: string) {
  const doc = await workoutCollection.doc(id).get();
  return {id, ...doc.data()} as PrebuiltWorkout;
};

export async function create(workout: PrebuiltWorkout) {
  return workoutCollection.add(workout);
}

export async function setAll(workout: PrebuiltWorkout) {
  if (!workout.id) {
    throw new Error('Attempt to update workout without workout ID');
  }
  return workoutCollection.doc(workout.id).set(workout);
}

export async function update(workoutId: string, fields: Partial<PrebuiltWorkout>) {
  if (!workoutId) {
    throw new Error('Attempt to update workout without workout ID');
  }
  return workoutCollection.doc(workoutId).update(fields);
}

export async function createOrUpdate(workout: PrebuiltWorkout){
  if (workout.id) return setAll(workout);
  return create(workout);
}

export async function destroy(workout: PrebuiltWorkout) {
  if (!workout.id) {
    throw new Error('Attempt to delete workout without workout ID');
  }
  return workoutCollection.doc(workout.id).delete();
}
