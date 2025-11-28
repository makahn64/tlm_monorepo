import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig, currentEnvironment } from '../config/firebase';

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Log current environment (helpful for debugging)
if (import.meta.env.DEV) {
  console.log(`🔥 Firebase initialized for: ${currentEnvironment}`);
  console.log(`📦 Project ID: ${firebaseConfig.projectId}`);
}
