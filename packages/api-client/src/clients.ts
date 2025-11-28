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
} from 'firebase/firestore';
import type { Client, ClientType } from '@lotus/shared-types';
import { NotFoundError, ValidationError } from './errors';

const CLIENTS_COLLECTION = 'clients';

/**
 * Converts Firestore document data to Client type
 */
const documentToClient = (id: string, data: DocumentData): Client => {
  return {
    uid: id,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    clientType: data.clientType,
    trainerIds: data.trainerIds || [],
    fitnessLevel: data.fitnessLevel || 'beginner',
    dateOfBirth: data.dateOfBirth,
    dueDate: data.dueDate,
    isPregnant: data.isPregnant || false,
    tryingToConceive: data.tryingToConceive,
    backPain: data.backPain || 'none',
    sciatica: data.sciatica || 'none',
    injuries: data.injuries || [],
    postureConditions: data.postureConditions || [],
    equipment: data.equipment || [],
    themeMode: data.themeMode || 'auto',
    accountActive: data.accountActive ?? true,
    hasAcceptedLiabilityWaiver: data.hasAcceptedLiabilityWaiver,
    hasCompletedOnboarding: data.hasCompletedOnboarding,
    markedForDeletion: data.markedForDeletion || false,
    schemaVersion: data.schemaVersion || 1,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

/**
 * Converts Client type to Firestore document data
 */
const clientToDocument = (client: Omit<Client, 'uid'>): DocumentData => {
  return {
    email: client.email,
    firstName: client.firstName,
    lastName: client.lastName,
    clientType: client.clientType,
    trainerIds: client.trainerIds,
    fitnessLevel: client.fitnessLevel,
    dateOfBirth: client.dateOfBirth,
    dueDate: client.dueDate,
    isPregnant: client.isPregnant,
    tryingToConceive: client.tryingToConceive,
    backPain: client.backPain,
    sciatica: client.sciatica,
    injuries: client.injuries,
    postureConditions: client.postureConditions,
    equipment: client.equipment,
    themeMode: client.themeMode,
    accountActive: client.accountActive,
    hasAcceptedLiabilityWaiver: client.hasAcceptedLiabilityWaiver,
    hasCompletedOnboarding: client.hasCompletedOnboarding,
    markedForDeletion: client.markedForDeletion,
    schemaVersion: client.schemaVersion,
    createdAt: Timestamp.fromDate(client.createdAt),
    updatedAt: Timestamp.fromDate(client.updatedAt),
  };
};

/**
 * Get all clients
 */
export const getAllClients = async (db: Firestore): Promise<Client[]> => {
  const clientsRef = collection(db, CLIENTS_COLLECTION);
  const snapshot = await getDocs(clientsRef);
  
  return snapshot.docs.map((doc) => documentToClient(doc.id, doc.data()));
};

/**
 * Get client by ID
 */
export const getClientById = async (db: Firestore, clientId: string): Promise<Client> => {
  const clientRef = doc(db, CLIENTS_COLLECTION, clientId);
  const clientDoc = await getDoc(clientRef);
  
  if (!clientDoc.exists()) {
    throw new NotFoundError('Client', clientId);
  }
  
  return documentToClient(clientDoc.id, clientDoc.data());
};

/**
 * Get clients by trainer ID
 */
export const getClientsByTrainer = async (
  db: Firestore,
  trainerId: string
): Promise<Client[]> => {
  const clientsRef = collection(db, CLIENTS_COLLECTION);
  const q = query(clientsRef, where('trainerIds', 'array-contains', trainerId));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => documentToClient(doc.id, doc.data()));
};

/**
 * Get clients by type
 */
export const getClientsByType = async (
  db: Firestore,
  clientType: ClientType
): Promise<Client[]> => {
  const clientsRef = collection(db, CLIENTS_COLLECTION);
  const q = query(clientsRef, where('clientType', '==', clientType));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => documentToClient(doc.id, doc.data()));
};

/**
 * Get clients by trainer and type
 */
export const getClientsByTrainerAndType = async (
  db: Firestore,
  trainerId: string,
  clientType: ClientType
): Promise<Client[]> => {
  const clientsRef = collection(db, CLIENTS_COLLECTION);
  const q = query(
    clientsRef,
    where('trainerIds', 'array-contains', trainerId),
    where('clientType', '==', clientType)
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => documentToClient(doc.id, doc.data()));
};

/**
 * Create a new client
 */
export const createClient = async (
  db: Firestore,
  clientData: Omit<Client, 'uid' | 'createdAt' | 'updatedAt'>
): Promise<Client> => {
  if (!clientData.email || !clientData.firstName || !clientData.lastName) {
    throw new ValidationError('Email, first name, and last name are required');
  }
  
  if (!clientData.clientType) {
    throw new ValidationError('Client type is required');
  }
  
  const now = new Date();
  const newClient: Omit<Client, 'uid'> = {
    ...clientData,
    trainerIds: clientData.trainerIds || [],
    fitnessLevel: clientData.fitnessLevel || 'beginner',
    isPregnant: clientData.isPregnant || false,
    backPain: clientData.backPain || 'none',
    sciatica: clientData.sciatica || 'none',
    injuries: clientData.injuries || [],
    postureConditions: clientData.postureConditions || [],
    equipment: clientData.equipment || [],
    themeMode: clientData.themeMode || 'auto',
    accountActive: clientData.accountActive ?? true,
    markedForDeletion: clientData.markedForDeletion || false,
    schemaVersion: clientData.schemaVersion || 1,
    createdAt: now,
    updatedAt: now,
  };
  
  const clientsRef = collection(db, CLIENTS_COLLECTION);
  const docRef = await addDoc(clientsRef, clientToDocument(newClient));
  
  return {
    uid: docRef.id,
    ...newClient,
  };
};

/**
 * Update an existing client
 */
export const updateClient = async (
  db: Firestore,
  clientId: string,
  updates: Partial<Omit<Client, 'uid' | 'createdAt'>>
): Promise<Client> => {
  const clientRef = doc(db, CLIENTS_COLLECTION, clientId);
  const clientDoc = await getDoc(clientRef);
  
  if (!clientDoc.exists()) {
    throw new NotFoundError('Client', clientId);
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
  
  await updateDoc(clientRef, updateData);
  
  return getClientById(db, clientId);
};

/**
 * Delete a client
 */
export const deleteClient = async (db: Firestore, clientId: string): Promise<void> => {
  const clientRef = doc(db, CLIENTS_COLLECTION, clientId);
  const clientDoc = await getDoc(clientRef);
  
  if (!clientDoc.exists()) {
    throw new NotFoundError('Client', clientId);
  }
  
  await deleteDoc(clientRef);
};

/**
 * Add trainer to client
 */
export const addTrainerToClient = async (
  db: Firestore,
  clientId: string,
  trainerId: string
): Promise<Client> => {
  const client = await getClientById(db, clientId);
  
  if (client.trainerIds.includes(trainerId)) {
    return client; // Trainer already assigned
  }
  
  return updateClient(db, clientId, {
    trainerIds: [...client.trainerIds, trainerId],
  });
};

/**
 * Remove trainer from client
 */
export const removeTrainerFromClient = async (
  db: Firestore,
  clientId: string,
  trainerId: string
): Promise<Client> => {
  const client = await getClientById(db, clientId);
  
  return updateClient(db, clientId, {
    trainerIds: client.trainerIds.filter((id) => id !== trainerId),
  });
};
