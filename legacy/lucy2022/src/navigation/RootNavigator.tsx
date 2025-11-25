import React from 'react';
import { ColdStateNavigator } from './ColdState/ColdStateNavigator';
import { HotStateNavigator } from './HotState/HotStateNavigator';
import { NavigationContainer } from '@react-navigation/native';
import { useTheme } from '../theme';
import {observer} from "mobx-react-lite";
import {useAuth} from "../mobx/mobxHooks";
import * as XLogger from '../services/XLogger';

export const RootNavigator = observer(() => {
  const { isLoggedIn } = useAuth();
  const { theme } = useTheme();

  XLogger.logDebug(`isLogged in ${isLoggedIn}`);

  const baseTheme = {
    dark: false,
    colors: {
      primary: theme.primary,
      background: theme.surface,
      card: theme.surface,
      text: theme.text,
      border: theme.border,
      notification: theme.primary,
    },
  };

  return (
    <NavigationContainer>
      {isLoggedIn ? <HotStateNavigator /> : <ColdStateNavigator />}
    </NavigationContainer>
  );
});
