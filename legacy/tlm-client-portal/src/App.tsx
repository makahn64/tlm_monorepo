import React from 'react';
import {useAuthState} from "./services/firebase/AuthProvider";
import {BrowserRouter} from 'react-router-dom';
import {LoginPage} from "./pages/auth/LoginPage";
import {ToastContainer} from 'react-toastify';
import {UIProvider} from "./services/ui/UIProvider";
import {ClientPortalRouter} from "./routes/ClientPortalRouter";

function App() {
  const {isLoggedIn, isClient} = useAuthState();
  const showPortal = !isClient && isLoggedIn;
  const showClient = isClient && isLoggedIn;
  return (
    <BrowserRouter>
      <UIProvider>
        { isLoggedIn ? <ClientPortalRouter/> : <LoginPage/> }
        <ToastContainer/>
      </UIProvider>
    </BrowserRouter>
  );
}

export default App;
