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
  QueryConstraint,
} from 'firebase/firestore';
import type { User, UserRole } from '@lotus/shared-types';
import { NotFoundError, ValidationError } from './errors';

const USERS_COLLECTION = 'users';

/**
 * Converts Firestore document data to User type
 */
const documentToUser = (id: string, data: DocumentData): User => {
  return {
    uid: id,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    roles: data.roles || [],
    clients: data.clients || [],
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

/**
 * Converts User type to Firestore document data
 */
const userToDocument = (user: Omit<User, 'uid'>): DocumentData => {
  return {
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    roles: user.roles,
    clients: user.clients || [],
    createdAt: Timestamp.fromDate(user.createdAt),
    updatedAt: Timestamp.fromDate(user.updatedAt),
  };
};

/**
 * Get all users
 */
export const getAllUsers = async (db: Firestore): Promise<User[]> => {
  const usersRef = collection(db, USERS_COLLECTION);
  const snapshot = await getDocs(usersRef);
  
  return snapshot.docs.map((doc) => documentToUser(doc.id, doc.data()));
};

/**
 * Get user by ID
 */
export const getUserById = async (db: Firestore, userId: string): Promise<User> => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new NotFoundError('User', userId);
  }
  
  return documentToUser(userDoc.id, userDoc.data());
};

/**
 * Get users by role
 */
export const getUsersByRole = async (
  db: Firestore,
  role: UserRole
): Promise<User[]> => {
  const usersRef = collection(db, USERS_COLLECTION);
  const q = query(usersRef, where('roles', 'array-contains', role));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => documentToUser(doc.id, doc.data()));
};

/**
 * Create a new user
 */
export const createUser = async (
  db: Firestore,
  userData: Omit<User, 'uid' | 'createdAt' | 'updatedAt'>
): Promise<User> => {
  if (!userData.email || !userData.firstName || !userData.lastName) {
    throw new ValidationError('Email, first name, and last name are required');
  }
  
  if (!userData.roles || userData.roles.length === 0) {
    throw new ValidationError('At least one role is required');
  }
  
  const now = new Date();
  const newUser: Omit<User, 'uid'> = {
    ...userData,
    clients: userData.clients || [],
    createdAt: now,
    updatedAt: now,
  };
  
  const usersRef = collection(db, USERS_COLLECTION);
  const docRef = await addDoc(usersRef, userToDocument(newUser));
  
  return {
    uid: docRef.id,
    ...newUser,
  };
};

/**
 * Update an existing user
 */
export const updateUser = async (
  db: Firestore,
  userId: string,
  updates: Partial<Omit<User, 'uid' | 'createdAt'>>
): Promise<User> => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new NotFoundError('User', userId);
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
  
  await updateDoc(userRef, updateData);
  
  return getUserById(db, userId);
};

/**
 * Delete a user
 */
export const deleteUser = async (db: Firestore, userId: string): Promise<void> => {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userDoc = await getDoc(userRef);
  
  if (!userDoc.exists()) {
    throw new NotFoundError('User', userId);
  }
  
  await deleteDoc(userRef);
};

/**
 * Get users with multiple role filters
 */
export const getUsersByRoles = async (
  db: Firestore,
  roles: UserRole[]
): Promise<User[]> => {
  if (roles.length === 0) {
    return getAllUsers(db);
  }
  
  // Firestore doesn't support OR queries directly, so we need to fetch for each role
  // and deduplicate
  const userSets = await Promise.all(
    roles.map((role) => getUsersByRole(db, role))
  );
  
  // Deduplicate by uid
  const userMap = new Map<string, User>();
  userSets.flat().forEach((user) => {
    userMap.set(user.uid, user);
  });
  
  return Array.from(userMap.values());
};
