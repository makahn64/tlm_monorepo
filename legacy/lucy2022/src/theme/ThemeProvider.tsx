import React, {FC, ReactChildren, ReactElement, useContext, useEffect, useState} from 'react';
import { ColorTheme } from './types';
import {availableThemes} from "./colorThemes";
import {WithChildren} from "../types/common";

const DEFAULT_THEME = 'light';

export type ThemeMode = 'light' | 'dark'

type CB = (mode: ThemeMode) => void;

let callback: CB = (mode) => console.log(mode);

function register(cb: CB) {
  callback = cb;
}

export function setThemeMode(mode: ThemeMode) {
  callback(mode);
}

interface ThemerInterface {
  themeMode: ThemeMode;
  theme: ColorTheme;
  setThemeMode: (m: ThemeMode) => void;
}

const ThemeContext = React.createContext<ThemerInterface>({
  themeMode: DEFAULT_THEME,
  theme: availableThemes[DEFAULT_THEME],
  setThemeMode: () => undefined, // this gets assigned in ThemeManager later
});

export const ThemeProvider = ({ children }: WithChildren) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const theme = availableThemes[themeMode];

  useEffect(() => {
    register((m)=>{
      setThemeMode(m);
    })
  },[])

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const { themeMode, setThemeMode, theme } = useContext(ThemeContext);
  return {
    themeMode,
    theme,
    setThemeMode,
    isDark: themeMode === 'dark',
  };
};

