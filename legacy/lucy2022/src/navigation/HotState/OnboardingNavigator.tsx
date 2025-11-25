import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { QuestionnaireScreen } from '~screens/Onboarding/QuestionnaireScreen';
import { OnboardLandingScreen } from '~screens/Onboarding/OnboardLandingScreen';
import { PregPostTryingScreen } from '~screens/Onboarding/PregPostTryingScreen';
import { OnboardingEndScreen } from '~screens/Onboarding/OnboardingEndScreen';

export type OBStackParams = {
  OnboardLanding: undefined;
  Questions: { sequence?: 'trying' | 'pregnant' | 'postnatal' };
  PregState: undefined;
  OBEnd: undefined;
};

const OBStack = createStackNavigator<OBStackParams>();

export const OnboardingNavigator = () => {
  return (
    <OBStack.Navigator screenOptions={{ headerShown: false }}>
      <OBStack.Screen name="OnboardLanding" component={OnboardLandingScreen} />
      <OBStack.Screen name="PregState" component={PregPostTryingScreen} />
      <OBStack.Screen name="Questions" component={QuestionnaireScreen} />
      <OBStack.Screen name="OBEnd" component={OnboardingEndScreen} />
    </OBStack.Navigator>
  );
};
