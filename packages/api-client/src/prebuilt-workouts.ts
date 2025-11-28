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
import type { PrebuiltWorkout, WorkoutType } from '@lotus/shared-types';
import { NotFoundError, ValidationError } from './errors';

const PREBUILT_WORKOUTS_COLLECTION = 'prebuiltWorkouts';

/**
 * Converts Firestore Timestamp to Date, handling null/undefined
 */
const timestampToDate = (timestamp: any): Date | undefined => {
  if (!timestamp) return undefined;
  return timestamp.toDate ? timestamp.toDate() : undefined;
};

/**
 * Converts Firestore document data to PrebuiltWorkout type
 */
const documentToPrebuiltWorkout = (id: string, data: DocumentData): PrebuiltWorkout => {
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
    authorId: data.authorId,
    visibility: data.visibility,
  };
};

/**
 * Converts PrebuiltWorkout type to Firestore document data
 */
const prebuiltWorkoutToDocument = (workout: Omit<PrebuiltWorkout, 'id'>): DocumentData => {
  const doc: DocumentData = {
    name: workout.name,
    workoutType: workout.workoutType,
    exercises: workout.exercises,
    createdBy: workout.createdBy,
    createdAt: Timestamp.fromDate(workout.createdAt),
    generatedBy: workout.generatedBy,
    duration: workout.duration,
    authorId: workout.authorId,
    visibility: workout.visibility,
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
 * Get all prebuilt workouts
 */
export const getAllPrebuiltWorkouts = async (db: Firestore): Promise<PrebuiltWorkout[]> => {
  const workoutsRef = collection(db, PREBUILT_WORKOUTS_COLLECTION);
  const q = query(workoutsRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => documentToPrebuiltWorkout(doc.id, doc.data()));
};

/**
 * Get prebuilt workout by ID
 */
export const getPrebuiltWorkoutById = async (
  db: Firestore,
  workoutId: string
): Promise<PrebuiltWorkout> => {
  const workoutRef = doc(db, PREBUILT_WORKOUTS_COLLECTION, workoutId);
  const workoutDoc = await getDoc(workoutRef);
  
  if (!workoutDoc.exists()) {
    throw new NotFoundError('Prebuilt Workout', workoutId);
  }
  
  return documentToPrebuiltWorkout(workoutDoc.id, workoutDoc.data());
};

/**
 * Get prebuilt workouts by author
 */
export const getPrebuiltWorkoutsByAuthor = async (
  db: Firestore,
  authorId: string
): Promise<PrebuiltWorkout[]> => {
  const workoutsRef = collection(db, PREBUILT_WORKOUTS_COLLECTION);
  const q = query(
    workoutsRef,
    where('authorId', '==', authorId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => documentToPrebuiltWorkout(doc.id, doc.data()));
};

/**
 * Get prebuilt workouts by visibility
 */
export const getPrebuiltWorkoutsByVisibility = async (
  db: Firestore,
  visibility: 'TLM' | 'private' | 'shared'
): Promise<PrebuiltWorkout[]> => {
  const workoutsRef = collection(db, PREBUILT_WORKOUTS_COLLECTION);
  const q = query(
    workoutsRef,
    where('visibility', '==', visibility),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => documentToPrebuiltWorkout(doc.id, doc.data()));
};

/**
 * Get prebuilt workouts accessible to a user
 * Returns TLM workouts, shared workouts, and user's private workouts
 */
export const getAccessiblePrebuiltWorkouts = async (
  db: Firestore,
  userId: string
): Promise<PrebuiltWorkout[]> => {
  // Get all workouts and filter client-side
  // Firestore doesn't support OR queries easily
  const allWorkouts = await getAllPrebuiltWorkouts(db);
  
  return allWorkouts.filter(
    (workout) =>
      workout.visibility === 'TLM' ||
      workout.visibility === 'shared' ||
      (workout.visibility === 'private' && workout.authorId === userId)
  );
};

/**
 * Get prebuilt workouts by type
 */
export const getPrebuiltWorkoutsByType = async (
  db: Firestore,
  workoutType: WorkoutType
): Promise<PrebuiltWorkout[]> => {
  const workoutsRef = collection(db, PREBUILT_WORKOUTS_COLLECTION);
  const q = query(
    workoutsRef,
    where('workoutType', '==', workoutType),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => documentToPrebuiltWorkout(doc.id, doc.data()));
};

/**
 * Create a new prebuilt workout
 */
export const createPrebuiltWorkout = async (
  db: Firestore,
  workoutData: Omit<PrebuiltWorkout, 'id'>
): Promise<PrebuiltWorkout> => {
  if (!workoutData.workoutType) {
    throw new ValidationError('Workout type is required');
  }
  
  if (!workoutData.authorId) {
    throw new ValidationError('Author ID is required');
  }
  
  if (!workoutData.visibility) {
    throw new ValidationError('Visibility is required');
  }
  
  if (!workoutData.exercises || workoutData.exercises.length === 0) {
    throw new ValidationError('At least one exercise is required');
  }
  
  const newWorkout: Omit<PrebuiltWorkout, 'id'> = {
    ...workoutData,
    createdAt: workoutData.createdAt || new Date(),
    createdBy: workoutData.createdBy || workoutData.authorId,
    generatedBy: workoutData.generatedBy || 'trainer',
  };
  
  const workoutsRef = collection(db, PREBUILT_WORKOUTS_COLLECTION);
  const docRef = await addDoc(workoutsRef, prebuiltWorkoutToDocument(newWorkout));
  
  return {
    id: docRef.id,
    ...newWorkout,
  };
};

/**
 * Update an existing prebuilt workout
 */
export const updatePrebuiltWorkout = async (
  db: Firestore,
  workoutId: string,
  updates: Partial<Omit<PrebuiltWorkout, 'id' | 'createdAt' | 'createdBy' | 'authorId'>>
): Promise<PrebuiltWorkout> => {
  const workoutRef = doc(db, PREBUILT_WORKOUTS_COLLECTION, workoutId);
  const workoutDoc = await getDoc(workoutRef);
  
  if (!workoutDoc.exists()) {
    throw new NotFoundError('Prebuilt Workout', workoutId);
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
  
  return getPrebuiltWorkoutById(db, workoutId);
};

/**
 * Delete a prebuilt workout
 */
export const deletePrebuiltWorkout = async (
  db: Firestore,
  workoutId: string
): Promise<void> => {
  const workoutRef = doc(db, PREBUILT_WORKOUTS_COLLECTION, workoutId);
  const workoutDoc = await getDoc(workoutRef);
  
  if (!workoutDoc.exists()) {
    throw new NotFoundError('Prebuilt Workout', workoutId);
  }
  
  await deleteDoc(workoutRef);
};

/**
 * Copy a prebuilt workout to create a regular workout for a client
 * This creates a new workout document based on the prebuilt template
 */
export const copyPrebuiltWorkoutToClient = async (
  db: Firestore,
  prebuiltWorkoutId: string,
  clientId: string,
  trainerId: string
): Promise<string> => {
  // Get the prebuilt workout
  const prebuiltWorkout = await getPrebuiltWorkoutById(db, prebuiltWorkoutId);
  
  // Create a new workout for the client based on the template
  const workoutData = {
    name: prebuiltWorkout.name,
    workoutType: prebuiltWorkout.workoutType,
    exercises: prebuiltWorkout.exercises,
    createdBy: trainerId,
    createdAt: new Date(),
    generatedBy: 'trainer' as const,
    duration: prebuiltWorkout.duration,
    internalNotes: prebuiltWorkout.internalNotes,
    avgIntensity: prebuiltWorkout.avgIntensity,
  };
  
  // Store in client's subcollection
  const workoutsRef = collection(db, `clients/${clientId}/workouts`);
  const docRef = await addDoc(workoutsRef, {
    ...workoutData,
    createdAt: Timestamp.fromDate(workoutData.createdAt),
  });
  
  return docRef.id;
};
