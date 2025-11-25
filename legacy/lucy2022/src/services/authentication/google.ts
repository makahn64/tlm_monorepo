import * as XLogger from '../../XLogger';
import { GoogleSignin } from '@react-native-community/google-signin';
import auth from '@react-native-firebase/auth';

export const signInWithGoogle = async () => {
  XLogger.log('firebaseAuth[service]/signInWithGoogle');
  GoogleSignin.configure({
    scopes: ['profile'],
    webClientId:
      '207697785725-9mrs6rthbo9lkbfoobjmcjdhen49m3co.apps.googleusercontent.com',
  });
  const { idToken } = await GoogleSignin.signIn();
  const credential = auth.GoogleAuthProvider.credential(idToken);
  const firebaseUserCredential = await auth().signInWithCredential(credential);
  return firebaseUserCredential && firebaseUserCredential.user
    ? firebaseUserCredential.user
    : null;
};
