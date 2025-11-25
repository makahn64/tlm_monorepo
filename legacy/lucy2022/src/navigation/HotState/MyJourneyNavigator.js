/*********************************

 File:       MyJourneyNavigator.js
 Function:   Top Tab Nav for MyJourney Bottom Tab
 Copyright:  The Lotus Method
 Date:       2020-03-10
 Author:     mkahn

 **********************************/

import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CalendarScreen from '../../screens/MyJourney/CalendarScreen';
import ProgressScreen from '../../screens/MyJourney/ProgressScreen';
import RewardsScreen from '../../screens/Rewards/RewardsScreen';
import { useTheme } from '../../themes/ThemeManager';
import getTabBarOptions from './getTabBarOptions';
import { useSafeArea } from 'react-native-safe-area-context';
import AppConfig from '../../config/AppConfig';

const Tab = createMaterialTopTabNavigator();

const MyJourneyNavigator = (props) => {
  const { theme } = useTheme();
  const tabBarOptions = getTabBarOptions(theme);
  const insets = useSafeArea();

  return (
    <Tab.Navigator
      tabBarOptions={tabBarOptions}
      style={{ paddingTop: insets.top }}>
      <Tab.Screen name={'Progress'} component={ProgressScreen} />
      {AppConfig.showRewardsScreen ? (
        <Tab.Screen name={'Rewards'} component={RewardsScreen} />
      ) : null}
      <Tab.Screen name={'History'} component={CalendarScreen} />
    </Tab.Navigator>
  );
};

MyJourneyNavigator.propTypes = {};

export default MyJourneyNavigator;
