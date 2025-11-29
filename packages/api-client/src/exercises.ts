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
import type { Exercise } from '@lotus/shared-types';
import { NotFoundError, ValidationError } from './errors';

const EXERCISES_COLLECTION = 'exercises';

/**
 * Converts Firestore document data to Exercise type
 */
const documentToExercise = (id: string, data: DocumentData): Exercise => {
  return {
    docId: id,
    title: data.title,
    name: data.name,
    description: data.description,
    movementPattern: data.movementPattern,
    intensity: data.intensity,
    stress: data.stress || [],
    releases: data.releases || [],
    activates: data.activates || [],
    equipment: data.equipment || [],
    optionalEquipment: data.optionalEquipment || [],
    cues: data.cues || [],
    duration: data.duration,
    prenatalVideo: data.prenatalVideo || {},
    postnatalVideo: data.postnatalVideo || {},
    instructionVideo: data.instructionVideo || {},
    prenatalThumb: data.prenatalThumb || {},
    postnatalThumb: data.postnatalThumb || {},
    instructionThumb: data.instructionThumb || {},
    isBreak: data.isBreak,
    isCustom: data.isCustom,
    published: data.published ?? true,
    archived: data.archived || false,
    preComposited: data.preComposited || false,
    metadata: data.metadata || null,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

/**
 * Converts Exercise type to Firestore document data
 */
const exerciseToDocument = (exercise: Omit<Exercise, 'docId'>): DocumentData => {
  return {
    title: exercise.title,
    name: exercise.name,
    description: exercise.description,
    movementPattern: exercise.movementPattern,
    intensity: exercise.intensity,
    stress: exercise.stress,
    releases: exercise.releases,
    activates: exercise.activates,
    equipment: exercise.equipment,
    optionalEquipment: exercise.optionalEquipment,
    cues: exercise.cues,
    duration: exercise.duration,
    prenatalVideo: exercise.prenatalVideo,
    postnatalVideo: exercise.postnatalVideo,
    instructionVideo: exercise.instructionVideo,
    prenatalThumb: exercise.prenatalThumb,
    postnatalThumb: exercise.postnatalThumb,
    instructionThumb: exercise.instructionThumb,
    isBreak: exercise.isBreak,
    isCustom: exercise.isCustom,
    published: exercise.published,
    archived: exercise.archived,
    preComposited: exercise.preComposited,
    metadata: exercise.metadata,
    createdAt: Timestamp.fromDate(exercise.createdAt),
    updatedAt: Timestamp.fromDate(exercise.updatedAt),
  };
};

/**
 * Get all exercises
 */
export const getAllExercises = async (db: Firestore): Promise<Exercise[]> => {
  const exercisesRef = collection(db, EXERCISES_COLLECTION);
  const q = query(exercisesRef, orderBy('name'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => documentToExercise(doc.id, doc.data()));
};

/**
 * Get exercise by ID
 */
export const getExerciseById = async (
  db: Firestore,
  exerciseId: string
): Promise<Exercise> => {
  const exerciseRef = doc(db, EXERCISES_COLLECTION, exerciseId);
  const exerciseDoc = await getDoc(exerciseRef);
  
  if (!exerciseDoc.exists()) {
    throw new NotFoundError('Exercise', exerciseId);
  }
  
  return documentToExercise(exerciseDoc.id, exerciseDoc.data());
};

/**
 * Get published exercises (not archived)
 */
export const getPublishedExercises = async (db: Firestore): Promise<Exercise[]> => {
  const exercisesRef = collection(db, EXERCISES_COLLECTION);
  const q = query(exercisesRef, orderBy('name'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs
    .map((doc) => documentToExercise(doc.id, doc.data()))
    .filter((exercise) => exercise.published && !exercise.archived);
};

/**
 * Search exercises by name
 */
export const searchExercisesByName = async (
  db: Firestore,
  searchTerm: string
): Promise<Exercise[]> => {
  // Note: Firestore doesn't support full-text search natively
  // This is a simple implementation that gets all exercises and filters client-side
  // For production, consider using Algolia or similar service
  const exercises = await getAllExercises(db);
  const lowerSearchTerm = searchTerm.toLowerCase();
  
  return exercises.filter(
    (exercise) =>
      exercise.name.toLowerCase().includes(lowerSearchTerm) ||
      exercise.title.toLowerCase().includes(lowerSearchTerm) ||
      exercise.description.toLowerCase().includes(lowerSearchTerm)
  );
};

/**
 * Get exercises by movement pattern
 */
export const getExercisesByMovementPattern = async (
  db: Firestore,
  movementPattern: string
): Promise<Exercise[]> => {
  const exercisesRef = collection(db, EXERCISES_COLLECTION);
  const q = query(
    exercisesRef,
    where('movementPattern', '==', movementPattern),
    where('archived', '==', false),
    orderBy('name')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => documentToExercise(doc.id, doc.data()));
};

/**
 * Get exercises by equipment
 */
export const getExercisesByEquipment = async (
  db: Firestore,
  equipment: string
): Promise<Exercise[]> => {
  const exercisesRef = collection(db, EXERCISES_COLLECTION);
  const q = query(
    exercisesRef,
    where('equipment', 'array-contains', equipment),
    where('archived', '==', false),
    orderBy('name')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => documentToExercise(doc.id, doc.data()));
};

/**
 * Filter exercises by multiple criteria
 */
export const filterExercises = async (
  db: Firestore,
  filters: {
    movementPattern?: string;
    equipment?: string;
    minIntensity?: number;
    maxIntensity?: number;
    published?: boolean;
    archived?: boolean;
  }
): Promise<Exercise[]> => {
  // Start with all exercises and filter client-side for complex queries
  // Firestore has limitations on compound queries
  let exercises = await getAllExercises(db);
  
  if (filters.movementPattern) {
    exercises = exercises.filter(
      (ex) => ex.movementPattern === filters.movementPattern
    );
  }
  
  if (filters.equipment) {
    exercises = exercises.filter((ex) => ex.equipment.includes(filters.equipment!));
  }
  
  if (filters.minIntensity !== undefined) {
    exercises = exercises.filter((ex) => ex.intensity >= filters.minIntensity!);
  }
  
  if (filters.maxIntensity !== undefined) {
    exercises = exercises.filter((ex) => ex.intensity <= filters.maxIntensity!);
  }
  
  if (filters.published !== undefined) {
    exercises = exercises.filter((ex) => ex.published === filters.published);
  }
  
  if (filters.archived !== undefined) {
    exercises = exercises.filter((ex) => ex.archived === filters.archived);
  }
  
  return exercises;
};

/**
 * Create a new exercise
 */
export const createExercise = async (
  db: Firestore,
  exerciseData: Omit<Exercise, 'docId' | 'createdAt' | 'updatedAt'>
): Promise<Exercise> => {
  if (!exerciseData.title || !exerciseData.name) {
    throw new ValidationError('Title and name are required');
  }
  
  if (!exerciseData.movementPattern) {
    throw new ValidationError('Movement pattern is required');
  }
  
  const now = new Date();
  const newExercise: Omit<Exercise, 'docId'> = {
    ...exerciseData,
    stress: exerciseData.stress || [],
    releases: exerciseData.releases || [],
    activates: exerciseData.activates || [],
    equipment: exerciseData.equipment || [],
    optionalEquipment: exerciseData.optionalEquipment || [],
    cues: exerciseData.cues || [],
    published: exerciseData.published ?? true,
    archived: exerciseData.archived || false,
    preComposited: exerciseData.preComposited || false,
    metadata: exerciseData.metadata || null,
    createdAt: now,
    updatedAt: now,
  };
  
  const exercisesRef = collection(db, EXERCISES_COLLECTION);
  const docRef = await addDoc(exercisesRef, exerciseToDocument(newExercise));
  
  return {
    docId: docRef.id,
    ...newExercise,
  };
};

/**
 * Update an existing exercise
 */
export const updateExercise = async (
  db: Firestore,
  exerciseId: string,
  updates: Partial<Omit<Exercise, 'docId' | 'createdAt'>>
): Promise<Exercise> => {
  const exerciseRef = doc(db, EXERCISES_COLLECTION, exerciseId);
  const exerciseDoc = await getDoc(exerciseRef);
  
  if (!exerciseDoc.exists()) {
    throw new NotFoundError('Exercise', exerciseId);
  }
  
  const updateData: DocumentData = {
    ...updates,
    updatedAt: Timestamp.fromDate(new Date()),
  };
  
  // Remove undefined values
  Object.keys(updateData).forEach((key) => {
    if (updateData[key] === undefined) {
      delete updateData[key];
    }
  });
  
  await updateDoc(exerciseRef, updateData);
  
  return getExerciseById(db, exerciseId);
};

/**
 * Archive an exercise (soft delete)
 */
export const archiveExercise = async (
  db: Firestore,
  exerciseId: string
): Promise<Exercise> => {
  return updateExercise(db, exerciseId, { archived: true });
};

/**
 * Unarchive an exercise
 */
export const unarchiveExercise = async (
  db: Firestore,
  exerciseId: string
): Promise<Exercise> => {
  return updateExercise(db, exerciseId, { archived: false });
};

/**
 * Delete an exercise (hard delete)
 */
export const deleteExercise = async (
  db: Firestore,
  exerciseId: string
): Promise<void> => {
  const exerciseRef = doc(db, EXERCISES_COLLECTION, exerciseId);
  const exerciseDoc = await getDoc(exerciseRef);
  
  if (!exerciseDoc.exists()) {
    throw new NotFoundError('Exercise', exerciseId);
  }
  
  await deleteDoc(exerciseRef);
};
