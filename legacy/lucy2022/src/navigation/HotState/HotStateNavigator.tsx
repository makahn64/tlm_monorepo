import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HotTabNavigator } from './HotTabNavigator';
import { useTheme } from '../../theme';
import {HotScreen} from "../../components/debug/PlaceholderScreen";

const HotStack = createNativeStackNavigator();

export const HotStateNavigator: FC = () => {
  const { theme } = useTheme();

  return (
    <HotStack.Navigator>
      <HotStack.Screen name="Hot" component={HotScreen} />
    </HotStack.Navigator>
  );
};
