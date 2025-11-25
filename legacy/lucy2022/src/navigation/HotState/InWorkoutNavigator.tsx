/*********************************
 File:       InWorkoutNavigator.js
 Function:   Handles the PreWorkout->Workout->Post Workout full screen, no tab, views
 Copyright:  The Lotus Method
 Date:       2020-03-13
 Author:     mkahn
 **********************************/

import React, { FC } from 'react';
import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack';
import { useTheme } from '../../themes';
import { LogoTitle } from '../../components/Logo/LogoTitle';
import DebugConfig from '../../config/DebugConfig';
import { WorkoutOverviewScreen } from '../../screens/Workouts/WorkoutOverviewScreen';
import Fonts from '../../themes/Fonts';
import Metrics from '../../themes/Metrics';
import { WorkoutSequencerScreen } from '../../screens/Workouts/WorkoutSequencer/WorkoutSequencerScreen';
import VerySimpleView from '../../screens/ZExperimental/VerySimpleView';
//import FullScreenWorkoutVideoScreen from '../../Screens/Workouts/FullScreenWorkoutVideoScreen';
// import WorkoutEndSlateScreen from '../../Screens/Workouts/WorkoutEndSlateScreen';

const WOStack = createStackNavigator();

export const InWorkoutNavigator: FC = () => {
  const { theme } = useTheme();

  const screenOptions: StackNavigationOptions = {
    headerStyle: {
      backgroundColor: '#8f6ca8',
    },
    headerTintColor: '#ffffff',
    headerTitleStyle: {
      marginHorizontal: Metrics.marginHorizontal,
      textAlign: 'left',
      color: 'white',
      marginVertical: 0,
      fontFamily: Fonts.type.extraLight,
      fontWeight: 'normal',
      fontSize: 26,
    },
    // // This MUST be undefined (not null)
    headerTitle: 'Your Workout',
    // // If no space, the default component renders  the default 'Back'
    headerBackTitle: ' ',
    // headerShown: false,
  };

  return (
    <WOStack.Navigator screenOptions={screenOptions}>
      <WOStack.Screen
        name={'WorkoutOverview'}
        component={WorkoutOverviewScreen}
      />
      <WOStack.Screen
        name={'WORKOUT_SEQUENCER'}
        component={WorkoutSequencerScreen}
        options={{ headerShown: false }}
      />
      <WOStack.Screen name={'END_SLATE'} component={VerySimpleView} />
    </WOStack.Navigator>
  );
};
