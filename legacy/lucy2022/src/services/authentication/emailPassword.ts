import * as XLogger from '../../XLogger';
import auth from '@react-native-firebase/auth';
import { FirebaseAuthError } from '../customFirebaseErrors';

export const signInWithEmailPassword = async (email, password) => {
  XLogger.log('firebaseAuth[service]/signInWithEmailAndPassword');
  try {
    const firebaseUserCredential = await auth().signInWithEmailAndPassword(
      email,
      password,
    );
    return firebaseUserCredential && firebaseUserCredential.user
      ? firebaseUserCredential.user
      : null;
  } catch (e) {
    throw new FirebaseAuthError(e);
  }
};

export const signInOrCreateWithEmailPassword = async (email, password) => {
  XLogger.log('firebaseAuth[service]/signInWithEmailAndPassword');
  try {
    const firebaseUserCredential = await auth().signInWithEmailAndPassword(
      email,
      password,
    );
    return firebaseUserCredential && firebaseUserCredential.user
      ? firebaseUserCredential.user
      : null;
  } catch (e) {
    throw new FirebaseAuthError(e);
  }
};

export const createFirebaseAuthAccountByEmailPassword = async (
  email,
  password,
  displayName,
) => {
  const authAccount = await auth().createUserWithEmailAndPassword(
    email,
    password,
  );
  XLogger.logDebug(
    `createFirebaseAuthAccountByEmailPassword setting display name to ${displayName}`,
  );
  await authAccount.user.updateProfile({ displayName: displayName });
  return authAccount;
};
