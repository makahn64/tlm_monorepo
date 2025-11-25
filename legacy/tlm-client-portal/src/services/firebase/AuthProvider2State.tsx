import React, {FC, PropsWithChildren, useContext, useEffect, useState} from 'react';
import { auth } from './firebaseCore'
import { MOCK_USER, MockUser } from "./mocks/user";
import firebase from "firebase";
import {Button, Modal} from "react-bootstrap";

const SHOULD_MOCK = process.env.REACT_APP_STAGE === 'mock';

type FirebaseUser = firebase.User | null | undefined;

interface AuthState {
  isLoggedIn: boolean;
  userProfile: FirebaseUser | MockUser;
  isAdmin: boolean;
  isTrainer: boolean;
}

const INITIAL_STATE = {
  isLoggedIn: false,
  userProfile: null,
  isAdmin: false,
  isTrainer: false
}

const AuthContext = React.createContext<AuthState>(INITIAL_STATE);

interface OwnProps {
  showDebugFooter?: boolean;
}

type Props = OwnProps;

export const AuthProvider: FC<PropsWithChildren<Props>> = ({ children, showDebugFooter }) => {

  const [ isLoggedIn, setIsLoggedIn ] = useState(SHOULD_MOCK);
  const [ userProfile, setUserProfile ] = useState<FirebaseUser | MockUser>(SHOULD_MOCK ? MOCK_USER  : null );
  const [ isTrainer, setIsTrainer ] = useState<boolean>(false);
  const [ isAdmin, setIsAdmin ] = useState<boolean>(false);
  const [ unauthorized, setUnauthorized ] = useState(false);


  useEffect(() => {

    const processUser = async (user: FirebaseUser) => {
      if (!user){
        setIsAdmin(false);
        setIsTrainer(false);
        setIsLoggedIn(false);
        console.log( 'Cold state' );
      } else {
        const { claims: { trainer, admin }} = await user.getIdTokenResult();
        const legit = ( trainer || admin );
        if (legit) {
          setIsTrainer(trainer);
          setIsAdmin(admin);
          setIsLoggedIn(true);
          setUserProfile(user);
          console.log( 'Hot state' );
        } else {
          setIsAdmin(false);
          setIsTrainer(false);
          setIsLoggedIn(false);
          setUnauthorized(true);
          console.warn( 'User with auth account with wrong claims attempted login.' );
        }
      }
    }

    if (!SHOULD_MOCK){
      auth.onAuthStateChanged( user => {
        processUser(user);
      });
    }
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    setUnauthorized(false);
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, userProfile: userProfile, isAdmin, isTrainer }}>
      {children}
      <AuthFooter isLoggedIn={isLoggedIn} userProfile={userProfile} isAdmin={isAdmin} isTrainer={isTrainer}/>
      <Modal show={unauthorized} onHide={handleLogout}>
        <Modal.Header closeButton>
          <Modal.Title>UNAUTHORIZED</Modal.Title>
        </Modal.Header>
        <Modal.Body>You are not authorized to use this system! Good day.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleLogout}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </AuthContext.Provider>
  );
};

const AuthFooter: FC<AuthState> = ({ isAdmin, isTrainer, isLoggedIn, userProfile}) => {
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
