import React, {CSSProperties, FC, useContext, useState} from 'react';
import {SpinnerDotted} from "spinners-react";

interface UIState {
  showLoader: (b: boolean) => void;
}

const INITIAL_STATE = {
  showLoader: () => {}
}

const UIContext = React.createContext<UIState>(INITIAL_STATE);

export const UIProvider: FC = ({ children }) => {

  const [ _showLoader, setShowLoader ] = useState(false);

  const showLoader = (show: boolean) => {
    setShowLoader(show);
  }

  return (
    <UIContext.Provider value={{ showLoader }}>
      { children }
      { _showLoader && <Curtain/> }
    </UIContext.Provider>
  )
};

const Curtain: FC = () => {
  return (
    <div style={styles.curtain} className="d-flex flex-column justify-content-center align-items-center">
      <div>
        <SpinnerDotted size={90} thickness={147} speed={100} color="rgba(108, 57, 172, 1)" />
      </div>
    </div>
  )
}

const styles = {
  curtain: {
    position: 'fixed',
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.8)',
    zIndex: 50000
  } as CSSProperties
}

export const useUI = () => {
  return useContext(UIContext);
}
