import React from 'react';
import { useTheme } from '../../themes';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import getTabBarOptions from './getTabBarOptions';
import EducationFundamentalsScreen from '../../screens/ForYou/EducationFundamentalsScreen';
// import ExercisesFundamentalsScreen from '../../Screens/ForYou/ExercisesFundamentalsScreen';
import { useSafeArea } from 'react-native-safe-area-context';
import VerySimpleView from '../../screens/ZExperimental/VerySimpleView';
import ForYouFundamentalsScreen from '../../screens/ForYou/ForYouFundamentalsScreen';
import ExercisesFundamentalsScreen from '../../screens/ForYou/ExercisesFundamentalsScreen';

const Tab = createMaterialTopTabNavigator();

export const FundamentalsNavigator = () => {
  const { theme } = useTheme();
  const tabBarOptions = getTabBarOptions(theme);
  const insets = useSafeArea();

  return (
    <Tab.Navigator
      tabBarOptions={tabBarOptions}
      style={{ paddingTop: insets.top }}>
      <Tab.Screen name={'FOR YOU'} component={ForYouFundamentalsScreen} />
      <Tab.Screen name={'EDUCATION'} component={EducationFundamentalsScreen} />
      <Tab.Screen name={'EXERCISES'} component={ExercisesFundamentalsScreen} />
    </Tab.Navigator>
  );
};

// <Tab.Navigator tabBarOptions={ tabBarOptions } style={ { paddingTop: insets.top } }>
//   <Tab.Screen name={ 'FOR YOU' } component={ ForYouFundamentalsScreen }/>
//   <Tab.Screen name={ 'EDUCATION' } component={ EducationFundamentalsScreen }/>
//   <Tab.Screen name={ 'EXERCISES' } component={ ExercisesFundamentalsScreen }/>
// </Tab.Navigator>
