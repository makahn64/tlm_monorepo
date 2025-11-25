import React, { FC } from 'react';
import {createNativeStackNavigator, NativeStackNavigationOptions} from "@react-navigation/native-stack";
import {ColdScreen} from "../../components/debug/PlaceholderScreen";

const ColdStack = createNativeStackNavigator();

export const ColdStateNavigator: FC = () => {

  const options: NativeStackNavigationOptions = {
    headerShown: false
  }

  return (
    <ColdStack.Navigator screenOptions={options}>
      <ColdStack.Screen
        name="ColdLanding"
        component={ColdLandingScreen}
        options={{ headerShown: false }}
      />
      <ColdStack.Screen
        name="Cold"
        component={ColdScreen}
      />
    </ColdStack.Navigator>
  );
};
