// this version supports client login to a video portal
import React, {FC, PropsWithChildren, useContext, useEffect, useReducer, useState} from 'react';
import { auth } from './firebaseCore'
import { MOCK_USER, MockUser } from "./mocks/user";
import firebase from "firebase";

const SHOULD_MOCK = process.env.REACT_APP_STAGE === 'mock';

type FirebaseUser = firebase.User | null | undefined;

interface AuthState {
  isLoggedIn: boolean;
  userProfile: FirebaseUser | MockUser;
  isAdmin: boolean;
  isTrainer: boolean;
  isClient: boolean;
}

const INITIAL_STATE = {
  isLoggedIn: false,
  userProfile: null,
  isAdmin: false,
  isTrainer: false,
  isClient: false
}

type Claims = { admin: boolean, trainer: boolean };

type AuthAction =
  | { type: 'login', userProfile: FirebaseUser | MockUser, claims: Claims }
  | { type: 'logout' };

const AuthContext = React.createContext<AuthState>(INITIAL_STATE);

const authReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case 'login':
      return {
      isAdmin: action.claims.admin,
      isTrainer: action.claims.trainer,
      isClient: !(action.claims.trainer || action.claims.admin),
      isLoggedIn: true,
      userProfile: action.userProfile
      }
    case 'logout': {
      return INITIAL_STATE;
    }
  }
}


type OwnProps = { showDebugFooter?: boolean; }
export const AuthProvider: FC<PropsWithChildren<OwnProps>> = ({ children, showDebugFooter }) => {

  const [ state, dispatch ] = useReducer(authReducer, INITIAL_STATE);
  const { isLoggedIn, isAdmin, isClient, isTrainer, userProfile } = state;

  useEffect(() => {

    const processUser = async (user: FirebaseUser) => {
        const response = await user!.getIdTokenResult();
        dispatch({ type: 'login', userProfile: user, claims: response.claims as Claims});
    }

    if (!SHOULD_MOCK){
      auth.onAuthStateChanged( user => {
        if (!user) {
          console.log('No user, logging out');
          dispatch({ type: 'logout'});
        } else {
          processUser(user);
        }
      });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, userProfile, isAdmin, isTrainer, isClient }}>
      {children}
      {/*<AuthFooter isLoggedIn={isLoggedIn} userProfile={userProfile} isAdmin={isAdmin} isTrainer={isTrainer}/>*/}
    </AuthContext.Provider>
  );
};

const AuthFooter: FC<Partial<AuthState>> = ({ isAdmin, isTrainer, isLoggedIn, userProfile}) => {
  return (
    <div style={styles.footer}>
      <p>{ isLoggedIn ? 'Logged in' : 'Not logged in'}&nbsp;|&nbsp;{userProfile?.email || 'No email'}&nbsp;|&nbsp;{userProfile?.displayName || 'No Display Name'}</p>
      <p>Roles: { isAdmin ? 'admin' : null} { isTrainer ? 'trainer' : null}</p>
    </div>
  )
}

const styles = {
  footer: {
    position: 'absolute' as 'absolute',
    bottom: '0',
    width: '100%',
    backgroundColor: 'salmon',
    height: '100px',
    padding: 10,
    display: 'hidden'
  }
}

export const useAuthState = () => {
  return useContext(AuthContext);
}
