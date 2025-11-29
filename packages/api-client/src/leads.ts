import type { Firestore } from 'firebase/firestore';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import type { Lead, LeadState } from '@lotus/shared-types';
import { NotFoundError } from './errors';

const COLLECTION_NAME = 'leads';

/**
 * Convert Firestore document data to Lead type
 */
const convertToLead = (id: string, data: any): Lead => {
  return {
    id,
    contactInfo: data.contactInfo,
    createdOn: data.createdOn instanceof Timestamp ? data.createdOn.toDate() : data.createdOn ? new Date(data.createdOn) : undefined,
    processedOn: data.processedOn instanceof Timestamp ? data.processedOn.toDate() : undefined,
    disposition: data.disposition,
    profile: data.profile,
  };
};

/**
 * Get all leads from Firestore
 */
export const getAllLeads = async (db: Firestore): Promise<Lead[]> => {
  const leadsRef = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(leadsRef);
  
  return snapshot.docs.map((doc) => convertToLead(doc.id, doc.data()));
};

/**
 * Get leads by disposition status
 */
export const getLeadsByDisposition = async (
  db: Firestore,
  disposition: LeadState
): Promise<Lead[]> => {
  const leadsRef = collection(db, COLLECTION_NAME);
  const q = query(leadsRef, where('disposition', '==', disposition));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => convertToLead(doc.id, doc.data()));
};

/**
 * Get unprocessed leads (no disposition set or disposition is 'unprocessed')
 */
export const getUnprocessedLeads = async (db: Firestore): Promise<Lead[]> => {
  const leadsRef = collection(db, COLLECTION_NAME);
  const q = query(
    leadsRef,
    where('disposition', 'in', ['unprocessed', null])
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => convertToLead(doc.id, doc.data()));
};

/**
 * Get a single lead by ID
 */
export const getLeadById = async (db: Firestore, id: string): Promise<Lead> => {
  const leadRef = doc(db, COLLECTION_NAME, id);
  const snapshot = await getDoc(leadRef);
  
  if (!snapshot.exists()) {
    throw new NotFoundError('Lead', id);
  }
  
  return convertToLead(snapshot.id, snapshot.data());
};

/**
 * Update a lead
 */
export const updateLead = async (
  db: Firestore,
  id: string,
  updates: Partial<Lead>
): Promise<void> => {
  const leadRef = doc(db, COLLECTION_NAME, id);
  
  // Convert Date objects to Timestamps for Firestore
  const firestoreUpdates: any = { ...updates };
  if (updates.processedOn) {
    firestoreUpdates.processedOn = Timestamp.fromDate(updates.processedOn);
  }
  if (updates.createdOn) {
    firestoreUpdates.createdOn = Timestamp.fromDate(updates.createdOn);
  }
  
  await updateDoc(leadRef, firestoreUpdates);
};

/**
 * Mark a lead as accepted
 */
export const acceptLead = async (db: Firestore, id: string): Promise<void> => {
  await updateLead(db, id, {
    disposition: 'accepted',
    processedOn: new Date(),
  });
};

/**
 * Mark a lead as dropped
 */
export const dropLead = async (db: Firestore, id: string): Promise<void> => {
  await updateLead(db, id, {
    disposition: 'dropped',
    processedOn: new Date(),
  });
};
