import React from 'react';
import './App.css';
import {TLMNavbar} from "./components/navigation/TLMNavbar";
import {BrowserRouter} from 'react-router-dom'
import {RootRoute} from "./routes/RootRoute";
import * as TLMFire from './services/firebase/firebaseCore';
import {useAuthState} from "./services/firebase/AuthProvider2State";
import {LoginPage} from "./pages/auth/LoginPage";
import {ToastContainer} from 'react-toastify';
import {UIProvider} from "./services/ui/UIProvider";

console.log(TLMFire);

function App() {

  const { isLoggedIn, isWaitingForFirebase } = useAuthState();

  return (
    <BrowserRouter>
      <UIProvider>
        { isWaitingForFirebase ? null :
          <>
            { !isLoggedIn && <LoginPage/> }
            { isLoggedIn && <>
              <TLMNavbar/>
              <RootRoute/>
            </> }
          </> }
        <ToastContainer/>
      </UIProvider>
    </BrowserRouter>

  );
}

export default App;
