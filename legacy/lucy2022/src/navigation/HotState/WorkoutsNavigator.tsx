import React, { FC } from 'react';
import { useTheme } from '../../themes';
import {
  WorkoutBin,
  WorkoutPickerScreen,
} from '../../screens/Workouts/WorkoutPickerScreen';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import getTabBarOptions from './getTabBarOptions';
import { useOnDemandWorkouts } from '../../services/Firebase/OnDemandWorkouts/onDemandWorkouts';
import OnDemandWorkoutsScreen from '../../screens/ForYou/OnDemandWorkoutsScreen';
import { SafeAreaView } from 'react-native';
// import PreWorkoutQScreen from '../../Screens/Questionnaire/QuestionnaireScreen';

const Tab = createMaterialTopTabNavigator();

export const WorkoutsNavigator: FC = () => {
  const { theme } = useTheme();
  const tabBarOptions = getTabBarOptions(theme);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator tabBarOptions={tabBarOptions}>
        <Tab.Screen name={'My Journey'}>
          {() => (
            <WorkoutPickerScreen
              workoutBin={WorkoutBin.notStartedOrInProgress}
            />
          )}
        </Tab.Screen>
        {/*<Tab.Screen name={'On Demand'}>*/}
        {/*  {() => <OnDemandWorkoutsScreen />}*/}
        {/*</Tab.Screen>*/}
        <Tab.Screen name={'Favs'}>
          {() => <WorkoutPickerScreen workoutBin={WorkoutBin.favorite} />}
        </Tab.Screen>
        <Tab.Screen name={'History'}>
          {() => <WorkoutPickerScreen workoutBin={WorkoutBin.historical} />}
        </Tab.Screen>
        <Tab.Screen name={'Premium'}>
          {() => <WorkoutPickerScreen workoutBin={WorkoutBin.favorite} />}
        </Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  );
};
