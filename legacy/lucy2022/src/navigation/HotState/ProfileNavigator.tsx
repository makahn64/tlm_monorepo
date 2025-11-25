import React from 'react';
import { ProfileScreen } from '~screens/Profile/ProfileScreen';
import { QuestionnaireScreen } from '~screens/Onboarding/QuestionnaireScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type ProfileStackParams = {
  ProfileScreen: undefined;
  Questions: { sequence?: string };
};

const ProfileStack = createNativeStackNavigator<ProfileStackParams>();

export const ProfileNavigator = () => {
  const screenOptions = {
    headerShown: true,
  };

  return (
    <ProfileStack.Navigator screenOptions={screenOptions}>
      <ProfileStack.Screen name={'ProfileScreen'} component={ProfileScreen} />
      <ProfileStack.Screen
        name={'Questions'}
        component={QuestionnaireScreen}
        options={{ headerShown: false }}
      />
    </ProfileStack.Navigator>
  );
};
