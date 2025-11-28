import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  DocumentData,
  orderBy,
} from 'firebase/firestore';
import type { Workout, WorkoutType, WorkoutStatus } from '@lotus/shared-types';
import { NotFoundError, ValidationError } from './errors';

const WORKOUTS_COLLECTION = 'workouts';

/**
 * Converts Firestore Timestamp to Date, handling null/undefined
 */
const timestampToDate = (timestamp: any): Date | undefined => {
  if (!timestamp) return undefined;
  return timestamp.toDate ? timestamp.toDate() : undefined;
};

/**
 * Converts Firestore document data to Workout type
 */
const documentToWorkout = (id: string, data: DocumentData): Workout => {
  return {
    id,
    name: data.name,
    workoutType: data.workoutType,
    exercises: data.exercises || [],
    createdBy: data.createdBy,
    createdAt: data.createdAt?.toDate() || new Date(),
    generatedBy: data.generatedBy || 'trainer',
    duration: data.duration,
    startedOn: timestampToDate(data.startedOn),
    completedOn: timestampToDate(data.completedOn),
    clientNotes: data.clientNotes,
    internalNotes: data.internalNotes,
    feedback: data.feedback,
    progress: data.progress,
    favorite: data.favorite,
    set: data.set,
    clientSnapshot: data.clientSnapshot,
    prioritizations: data.prioritizations,
    eliminations: data.eliminations,
    avgIntensity: data.avgIntensity,
  };
};

/**
 * Converts Workout type to Firestore document data
 */
const workoutToDocument = (workout: Omit<Workout, 'id'>): DocumentData => {
  const doc: DocumentData = {
    name: workout.name,
    workoutType: workout.workoutType,
    exercises: workout.exercises,
    createdBy: workout.createdBy,
    createdAt: Timestamp.fromDate(workout.createdAt),
    generatedBy: workout.generatedBy,
    duration: workout.duration,
  };
  
  if (workout.startedOn) {
    doc.startedOn = Timestamp.fromDate(workout.startedOn);
  }
  
  if (workout.completedOn) {
    doc.completedOn = Timestamp.fromDate(workout.completedOn);
  }
  
  if (workout.clientNotes) doc.clientNotes = workout.clientNotes;
  if (workout.internalNotes) doc.internalNotes = workout.internalNotes;
  if (workout.feedback) doc.feedback = workout.feedback;
  if (workout.progress) doc.progress = workout.progress;
  if (workout.favorite !== undefined) doc.favorite = workout.favorite;
  if (workout.set !== undefined) doc.set = workout.set;
  if (workout.clientSnapshot) doc.clientSnapshot = workout.clientSnapshot;
  if (workout.prioritizations) doc.prioritizations = workout.prioritizations;
  if (workout.eliminations) doc.eliminations = workout.eliminations;
  if (workout.avgIntensity !== undefined) doc.avgIntensity = workout.avgIntensity;
  
  return doc;
};

/**
 * Get all workouts
 */
export const getAllWorkouts = async (db: Firestore): Promise<Workout[]> => {
  const workoutsRef = collection(db, WORKOUTS_COLLECTION);
  const q = query(workoutsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => documentToWorkout(doc.id, doc.data()));
};

/**
 * Get workout by ID
 */
export const getWorkoutById = async (
  db: Firestore,
  workoutId: string
): Promise<Workout> => {
  const workoutRef = doc(db, WORKOUTS_COLLECTION, workoutId);
  const workoutDoc = await getDoc(workoutRef);
  
  if (!workoutDoc.exists()) {
    throw new NotFoundError('Workout', workoutId);
  }
  
  return documentToWorkout(workoutDoc.id, workoutDoc.data());
};

/**
 * Get workouts by creator
 */
export const getWorkoutsByCreator = async (
  db: Firestore,
  creatorId: string
): Promise<Workout[]> => {
  const workoutsRef = collection(db, WORKOUTS_COLLECTION);
  const q = query(
    workoutsRef,
    where('createdBy', '==', creatorId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => documentToWorkout(doc.id, doc.data()));
};

/**
 * Get workouts by type
 */
export const getWorkoutsByType = async (
  db: Firestore,
  workoutType: WorkoutType
): Promise<Workout[]> => {
  const workoutsRef = collection(db, WORKOUTS_COLLECTION);
  const q = query(
    workoutsRef,
    where('workoutType', '==', workoutType),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => documentToWorkout(doc.id, doc.data()));
};

/**
 * Get workouts for a client
 * Note: This assumes workouts are stored in a subcollection under clients
 * or have a clientId field. Adjust based on actual data structure.
 */
export const getWorkoutsForClient = async (
  db: Firestore,
  clientId: string
): Promise<Workout[]> => {
  // Option 1: If workouts are in a subcollection
  const workoutsRef = collection(db, `clients/${clientId}/workouts`);
  const q = query(workoutsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => documentToWorkout(doc.id, doc.data()));
};

/**
 * Create a new workout
 */
export const createWorkout = async (
  db: Firestore,
  workoutData: Omit<Workout, 'id'>
): Promise<Workout> => {
  if (!workoutData.workoutType) {
    throw new ValidationError('Workout type is required');
  }
  
  if (!workoutData.createdBy) {
    throw new ValidationError('Creator ID is required');
  }
  
  if (!workoutData.exercises || workoutData.exercises.length === 0) {
    throw new ValidationError('At least one exercise is required');
  }
  
  const newWorkout: Omit<Workout, 'id'> = {
    ...workoutData,
    createdAt: workoutData.createdAt || new Date(),
    generatedBy: workoutData.generatedBy || 'trainer',
  };
  
  const workoutsRef = collection(db, WORKOUTS_COLLECTION);
  const docRef = await addDoc(workoutsRef, workoutToDocument(newWorkout));
  
  return {
    id: docRef.id,
    ...newWorkout,
  };
};

/**
 * Create a workout for a specific client
 */
export const createWorkoutForClient = async (
  db: Firestore,
  clientId: string,
  workoutData: Omit<Workout, 'id'>
): Promise<Workout> => {
  if (!workoutData.workoutType) {
    throw new ValidationError('Workout type is required');
  }
  
  if (!workoutData.createdBy) {
    throw new ValidationError('Creator ID is required');
  }
  
  if (!workoutData.exercises || workoutData.exercises.length === 0) {
    throw new ValidationError('At least one exercise is required');
  }
  
  const newWorkout: Omit<Workout, 'id'> = {
    ...workoutData,
    createdAt: workoutData.createdAt || new Date(),
    generatedBy: workoutData.generatedBy || 'trainer',
  };
  
  // Store in client's subcollection
  const workoutsRef = collection(db, `clients/${clientId}/workouts`);
  const docRef = await addDoc(workoutsRef, workoutToDocument(newWorkout));
  
  return {
    id: docRef.id,
    ...newWorkout,
  };
};

/**
 * Update an existing workout
 */
export const updateWorkout = async (
  db: Firestore,
  workoutId: string,
  updates: Partial<Omit<Workout, 'id' | 'createdAt' | 'createdBy'>>
): Promise<Workout> => {
  const workoutRef = doc(db, WORKOUTS_COLLECTION, workoutId);
  const workoutDoc = await getDoc(workoutRef);
  
  if (!workoutDoc.exists()) {
    throw new NotFoundError('Workout', workoutId);
  }
  
  const updateData: DocumentData = { ...updates };
  
  // Handle date conversions
  if (updates.startedOn) {
    updateData.startedOn = Timestamp.fromDate(updates.startedOn);
  }
  
  if (updates.completedOn) {
    updateData.completedOn = Timestamp.fromDate(updates.completedOn);
  }
  
  // Remove undefined values
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });
  
  await updateDoc(workoutRef, updateData);
  
  return getWorkoutById(db, workoutId);
};

/**
 * Update a client's workout
 */
export const updateClientWorkout = async (
  db: Firestore,
  clientId: string,
  workoutId: string,
  updates: Partial<Omit<Workout, 'id' | 'createdAt' | 'createdBy'>>
): Promise<Workout> => {
  const workoutRef = doc(db, `clients/${clientId}/workouts`, workoutId);
  const workoutDoc = await getDoc(workoutRef);
  
  if (!workoutDoc.exists()) {
    throw new NotFoundError('Workout', workoutId);
  }
  
  const updateData: DocumentData = { ...updates };
  
  // Handle date conversions
  if (updates.startedOn) {
    updateData.startedOn = Timestamp.fromDate(updates.startedOn);
  }
  
  if (updates.completedOn) {
    updateData.completedOn = Timestamp.fromDate(updates.completedOn);
  }
  
  // Remove undefined values
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });
  
  await updateDoc(workoutRef, updateData);
  
  const updatedDoc = await getDoc(workoutRef);
  return documentToWorkout(updatedDoc.id, updatedDoc.data()!);
};

/**
 * Delete a workout
 */
export const deleteWorkout = async (
  db: Firestore,
  workoutId: string
): Promise<void> => {
  const workoutRef = doc(db, WORKOUTS_COLLECTION, workoutId);
  const workoutDoc = await getDoc(workoutRef);
  
  if (!workoutDoc.exists()) {
    throw new NotFoundError('Workout', workoutId);
  }
  
  await deleteDoc(workoutRef);
};

/**
 * Delete a client's workout
 */
export const deleteClientWorkout = async (
  db: Firestore,
  clientId: string,
  workoutId: string
): Promise<void> => {
  const workoutRef = doc(db, `clients/${clientId}/workouts`, workoutId);
  const workoutDoc = await getDoc(workoutRef);
  
  if (!workoutDoc.exists()) {
    throw new NotFoundError('Workout', workoutId);
  }
  
  await deleteDoc(workoutRef);
};

/**
 * Mark workout as started
 */
export const startWorkout = async (
  db: Firestore,
  clientId: string,
  workoutId: string
): Promise<Workout> => {
  return updateClientWorkout(db, clientId, workoutId, {
    startedOn: new Date(),
    progress: {
      status: 'inProgress' as WorkoutStatus,
      exerciseIndex: 0,
      playbackTime: 0,
    },
  });
};

/**
 * Mark workout as completed
 */
export const completeWorkout = async (
  db: Firestore,
  clientId: string,
  workoutId: string
): Promise<Workout> => {
  return updateClientWorkout(db, clientId, workoutId, {
    completedOn: new Date(),
    progress: {
      status: 'complete' as WorkoutStatus,
      exerciseIndex: 0,
      playbackTime: 0,
    },
  });
};
