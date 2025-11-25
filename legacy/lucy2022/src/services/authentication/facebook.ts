import * as XLogger from '../../XLogger';
import { FirebaseAuthError } from '../customFirebaseErrors';
import auth from '@react-native-firebase/auth';
import { AccessToken, LoginManager } from 'react-native-fbsdk';

export const signInWithFacebook = async () => {
  XLogger.log('firebaseAuth[service]/signInWithFacebook');
  const result = await LoginManager.logInWithPermissions([
    'public_profile',
    'email',
  ]);
  if (result.isCancelled) {
    throw new FirebaseAuthError({
      code: 'auth/facebook-usercancel',
      message: 'User cancelled the Facebook login process',
      userInfo: 'FACEBOOK_USER_CANCELED',
    });
  }

  XLogger.log(
    `firebaseAuth[service]/signInWithFacebook: Facebook authenticated with permissions= ${result.grantedPermissions.toString()} but stay tuned because we still need to check against Firebase auth.`,
  );

  // get the access token
  const data = await AccessToken.getCurrentAccessToken();

  if (!data) {
    XLogger.warn(
      'firebaseAuth[service]/signInWithFacebook: Could not get token.',
    );
    throw new FirebaseAuthError({
      code: 'auth/facebook-notoken',
      message: 'Facebook did not return a token.',
      userInfo: 'FACEBOOK_NO_TOKEN',
    });
  }

  // create a new firebase credential with the token
  const credential = auth.FacebookAuthProvider.credential(data.accessToken);
  // login with credential
  try {
    const firebaseUserCredential = await auth().signInWithCredential(
      credential,
    );
    XLogger.logDebug(
      'firebaseAuth[service]/signInWithFacebook: successful Facebook flow!.',
    );
    return firebaseUserCredential && firebaseUserCredential.user
      ? firebaseUserCredential.user
      : null;
  } catch (e) {
    XLogger.warn(
      'firebaseAuth[service]/signInWithFacebook: could not login to Firebase after successful FB auth.',
    );
    throw new FirebaseAuthError(e);
  }
};
