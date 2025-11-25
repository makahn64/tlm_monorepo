import auth from '@react-native-firebase/auth';

export * from './google';
export * from './apple';
export * from './emailPassword';
export * from './facebook';

export const requestNewPassword = async (email) =>
  auth().sendPasswordResetEmail(email);

export const signOut = async () => auth().signOut();
