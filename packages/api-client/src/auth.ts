import {
  Auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  UserCredential,
  ConfirmationResult,
} from 'firebase/auth';
import { AuthenticationError } from './errors';

/**
 * Maps Firebase Auth error codes to user-friendly messages
 */
const getAuthErrorMessage = (errorCode: string): string => {
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'Invalid email address format.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled.',
    'auth/invalid-credential': 'Invalid credentials provided.',
    'auth/account-exists-with-different-credential':
      'An account already exists with the same email but different sign-in credentials.',
    'auth/invalid-verification-code': 'Invalid verification code.',
    'auth/invalid-verification-id': 'Invalid verification ID.',
    'auth/missing-verification-code': 'Verification code is required.',
    'auth/missing-verification-id': 'Verification ID is required.',
    'auth/quota-exceeded': 'SMS quota exceeded. Please try again later.',
    'auth/captcha-check-failed': 'reCAPTCHA verification failed.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
  };

  return errorMessages[errorCode] || 'An unexpected error occurred. Please try again.';
};

/**
 * Handles Firebase Auth errors and throws AuthenticationError
 */
const handleAuthError = (error: any): never => {
  const errorCode = error?.code || 'unknown';
  const message = getAuthErrorMessage(errorCode);
  throw new AuthenticationError(message);
}

/**
 * Type guard to ensure we never return from error handler
 */
const assertNever = (x: never): never => {
  throw new Error('Unexpected value: ' + x);
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (
  auth: Auth,
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    return handleAuthError(error);
  }
};

/**
 * Sign in with Google
 */
export const signInWithGoogle = async (auth: Auth): Promise<UserCredential> => {
  try {
    const provider = new GoogleAuthProvider();
    return await signInWithPopup(auth, provider);
  } catch (error) {
    return handleAuthError(error);
  }
};

/**
 * Sign in with Apple
 */
export const signInWithApple = async (auth: Auth): Promise<UserCredential> => {
  try {
    const provider = new OAuthProvider('apple.com');
    return await signInWithPopup(auth, provider);
  } catch (error) {
    return handleAuthError(error);
  }
};

/**
 * Sign in with phone number
 * Returns a ConfirmationResult that can be used to verify the SMS code
 */
export const signInWithPhone = async (
  auth: Auth,
  phoneNumber: string,
  recaptchaVerifier: RecaptchaVerifier
): Promise<ConfirmationResult> => {
  try {
    return await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
  } catch (error) {
    return handleAuthError(error);
  }
};

/**
 * Sign out the current user
 */
export const signOut = async (auth: Auth): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    handleAuthError(error);
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (auth: Auth, email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    handleAuthError(error);
  }
};
