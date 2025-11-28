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
  orderBy,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';
import type { TrainerNote, Recommendation } from '@lotus/shared-types';
import { NotFoundError, ValidationError } from './errors';

const NOTES_COLLECTION = 'trainerNotes';
const RECOMMENDATIONS_COLLECTION = 'recommendations';

/**
 * Converts Firestore document data to TrainerNote type
 */
const documentToNote = (id: string, data: DocumentData): TrainerNote => {
  return {
    id,
    clientId: data.clientId,
    trainerId: data.trainerId,
    trainerName: data.trainerName,
    content: data.content,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

/**
 * Converts TrainerNote type to Firestore document data
 */
const noteToDocument = (note: Omit<TrainerNote, 'id'>): DocumentData => {
  return {
    clientId: note.clientId,
    trainerId: note.trainerId,
    trainerName: note.trainerName,
    content: note.content,
    createdAt: Timestamp.fromDate(note.createdAt),
    updatedAt: Timestamp.fromDate(note.updatedAt),
  };
};

/**
 * Converts Firestore document data to Recommendation type
 */
const documentToRecommendation = (id: string, data: DocumentData): Recommendation => {
  return {
    id,
    clientId: data.clientId,
    trainerId: data.trainerId,
    trainerName: data.trainerName,
    title: data.title,
    description: data.description,
    createdAt: data.createdAt?.toDate() || new Date(),
  };
};

/**
 * Converts Recommendation type to Firestore document data
 */
const recommendationToDocument = (rec: Omit<Recommendation, 'id'>): DocumentData => {
  return {
    clientId: rec.clientId,
    trainerId: rec.trainerId,
    trainerName: rec.trainerName,
    title: rec.title,
    description: rec.description,
    createdAt: Timestamp.fromDate(rec.createdAt),
  };
};

/**
 * Get all notes for a client
 */
export const getNotesByClient = async (
  db: Firestore,
  clientId: string
): Promise<TrainerNote[]> => {
  const notesRef = collection(db, NOTES_COLLECTION);
  const q = query(notesRef, where('clientId', '==', clientId));
  const snapshot = await getDocs(q);

  const notes = snapshot.docs.map((doc) => documentToNote(doc.id, doc.data()));
  
  // Sort client-side to avoid needing a Firestore composite index
  return notes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

/**
 * Get a single note by ID
 */
export const getNoteById = async (db: Firestore, noteId: string): Promise<TrainerNote> => {
  const noteRef = doc(db, NOTES_COLLECTION, noteId);
  const noteDoc = await getDoc(noteRef);

  if (!noteDoc.exists()) {
    throw new NotFoundError('Note', noteId);
  }

  return documentToNote(noteDoc.id, noteDoc.data());
};

/**
 * Create a new trainer note
 */
export const createNote = async (
  db: Firestore,
  noteData: Omit<TrainerNote, 'id' | 'createdAt' | 'updatedAt'>
): Promise<TrainerNote> => {
  if (!noteData.clientId || !noteData.trainerId || !noteData.content.trim()) {
    throw new ValidationError('Client ID, trainer ID, and content are required');
  }

  const now = new Date();
  const newNote: Omit<TrainerNote, 'id'> = {
    ...noteData,
    createdAt: now,
    updatedAt: now,
  };

  const notesRef = collection(db, NOTES_COLLECTION);
  const docRef = await addDoc(notesRef, noteToDocument(newNote));

  return {
    id: docRef.id,
    ...newNote,
  };
};

/**
 * Update an existing note
 */
export const updateNote = async (
  db: Firestore,
  noteId: string,
  updates: { content: string }
): Promise<TrainerNote> => {
  const noteRef = doc(db, NOTES_COLLECTION, noteId);
  const noteDoc = await getDoc(noteRef);

  if (!noteDoc.exists()) {
    throw new NotFoundError('Note', noteId);
  }

  if (!updates.content.trim()) {
    throw new ValidationError('Content cannot be empty');
  }

  const updateData: DocumentData = {
    content: updates.content,
    updatedAt: Timestamp.fromDate(new Date()),
  };

  await updateDoc(noteRef, updateData);

  return getNoteById(db, noteId);
};

/**
 * Delete a note
 */
export const deleteNote = async (db: Firestore, noteId: string): Promise<void> => {
  const noteRef = doc(db, NOTES_COLLECTION, noteId);
  const noteDoc = await getDoc(noteRef);

  if (!noteDoc.exists()) {
    throw new NotFoundError('Note', noteId);
  }

  await deleteDoc(noteRef);
};

/**
 * Get all recommendations for a client
 */
export const getRecommendationsByClient = async (
  db: Firestore,
  clientId: string
): Promise<Recommendation[]> => {
  const recsRef = collection(db, RECOMMENDATIONS_COLLECTION);
  const q = query(recsRef, where('clientId', '==', clientId));
  const snapshot = await getDocs(q);

  const recommendations = snapshot.docs.map((doc) => documentToRecommendation(doc.id, doc.data()));
  
  // Sort client-side to avoid needing a Firestore composite index
  return recommendations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

/**
 * Create a new recommendation
 */
export const createRecommendation = async (
  db: Firestore,
  recData: Omit<Recommendation, 'id' | 'createdAt'>
): Promise<Recommendation> => {
  if (!recData.clientId || !recData.trainerId || !recData.title.trim()) {
    throw new ValidationError('Client ID, trainer ID, and title are required');
  }

  const newRec: Omit<Recommendation, 'id'> = {
    ...recData,
    createdAt: new Date(),
  };

  const recsRef = collection(db, RECOMMENDATIONS_COLLECTION);
  const docRef = await addDoc(recsRef, recommendationToDocument(newRec));

  return {
    id: docRef.id,
    ...newRec,
  };
};

/**
 * Delete a recommendation
 */
export const deleteRecommendation = async (db: Firestore, recId: string): Promise<void> => {
  const recRef = doc(db, RECOMMENDATIONS_COLLECTION, recId);
  const recDoc = await getDoc(recRef);

  if (!recDoc.exists()) {
    throw new NotFoundError('Recommendation', recId);
  }

  await deleteDoc(recRef);
};
