import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { getUserById } from '@lotus/api-client';
import type { User } from '@lotus/shared-types';
import {
  signInWithEmail,
  signInWithGoogle,
  signInWithApple,
  signOut as apiSignOut,
  resetPassword as apiResetPassword,
} from '@lotus/api-client';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: Error | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setFirebaseUser(firebaseUser);
      
      if (firebaseUser) {
        try {
          // Fetch user data from Firestore
          const userData = await getUserById(db, firebaseUser.uid);
          setUser(userData);
          setError(null);
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError(err as Error);
          setUser(null);
        }
      } else {
        setUser(null);
        setError(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignInWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      setError(null);
      await signInWithEmail(auth, email, password);
      // User state will be updated by onAuthStateChanged
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const handleSignInWithGoogle = async (): Promise<void> => {
    try {
      setError(null);
      await signInWithGoogle(auth);
      // User state will be updated by onAuthStateChanged
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const handleSignInWithApple = async (): Promise<void> => {
    try {
      setError(null);
      await signInWithApple(auth);
      // User state will be updated by onAuthStateChanged
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const handleSignOut = async (): Promise<void> => {
    try {
      setError(null);
      await apiSignOut(auth);
      // User state will be updated by onAuthStateChanged
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const handleResetPassword = async (email: string): Promise<void> => {
    try {
      setError(null);
      await apiResetPassword(auth, email);
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    error,
    signInWithEmail: handleSignInWithEmail,
    signInWithGoogle: handleSignInWithGoogle,
    signInWithApple: handleSignInWithApple,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
