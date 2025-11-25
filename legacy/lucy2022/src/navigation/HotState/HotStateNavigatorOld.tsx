import React, { FC } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import VerySimpleView from '../../Screens/ZExperimental/VerySimpleView';
import { HotTabNavigator } from './HotTabNavigator';
import { useTheme } from '../../themes';
import { InWorkoutNavigator } from './InWorkoutNavigator';
// import { WorkoutSequencerScreen } from '../../screens/Workouts/WorkoutSequencer/WorkoutSequencerScreen';
// import { PlaceholderScreen } from '../../screens/Debug/PlaceholderScreen';
import { useClient } from '../../services/Firebase/Clients/ClientProvider';
import { OnboardingNavigator } from './OnboardingNavigator';
// import VideoOverlayScreen from '../../Screens/Video/VideoOverlayScreen';

const HotStack = createNativeStackNavigator();

export const HotStateNavigatorOld: FC = () => {
  const { theme } = useTheme();
  const { client } = useClient();

  const options = {
    headerShown: false,
    headerStyle: {
      backgroundColor: theme.surface,
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
    },
  };

  return (
    <HotStack.Navigator screenOptions={options}>
      {!client?.hasCompletedOnboarding ? (
        <HotStack.Screen name="Onboarding" component={OnboardingNavigator} />
      ) : (
        <>
          <HotStack.Screen name="HOT_TABS" component={HotTabNavigator} />
          <HotStack.Screen name="IN_WORKOUT" component={InWorkoutNavigator} />
        </>
      )}

      {/*<HotStack.Screen name="VideoOverlay" component={VideoOverlayScreen} />*/}
    </HotStack.Navigator>
  );
};
