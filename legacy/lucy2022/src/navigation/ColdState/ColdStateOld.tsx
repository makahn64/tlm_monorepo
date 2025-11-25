import React, { FC } from 'react';
import { ColdLandingScreen } from '../../screens';
//import { LoginScreen } from '~screens/AuthAndSignup/LoginScreen';
import { CreateAccountScreen } from '~screens/AuthAndSignup/CreateAccountScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignInEmailScreen } from '~screens/AuthAndSignup/SignInEmailScreen';

type FlowType = { flow: 'login' | 'create' };

export type ColdStackParams = {
  ColdLanding: undefined;
  LoginOrCreate: FlowType;
  SignInEmail: FlowType;
};

const ColdStack = createNativeStackNavigator<ColdStackParams>();

const SCREEN_OPTIONS = {
  headerBackTitleVisible: false,
  headerShadowVisible: false,
  headerTitle: '',
};

export const ColdStateNavigator: FC = () => {
  return (
    <ColdStack.Navigator screenOptions={SCREEN_OPTIONS}>
      <ColdStack.Screen
        name="ColdLanding"
        component={ColdLandingScreen}
        options={{ headerShown: false }}
      />
      <ColdStack.Screen name="LoginOrCreate" component={CreateAccountScreen} />
      <ColdStack.Screen name="SignInEmail" component={SignInEmailScreen} />
    </ColdStack.Navigator>
  );
};
