import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../../themes';
import Images from '../../themes/Images';
import Metrics from '../../themes/Metrics';
import { Image } from 'react-native';
import VerySimpleView from '../../screens/ZExperimental/VerySimpleView';
import { ProfileNavigator } from './ProfileNavigator';
import { FundamentalsNavigator } from './FundamentalsNavigator';
import { WorkoutsNavigator } from './WorkoutsNavigator';
//import WorkoutsNavigator from './WorkoutsNavigator';

const RootTabs = createBottomTabNavigator();

const TAB_ICON_STYLE = {
  height: Metrics.tabBarIcon,
  width: Metrics.tabBarIcon,
  marginTop: 10 * Metrics.deviceScaleFactor,
  marginBottom: 5 * Metrics.deviceScaleFactor,
};
export const HotTabNavigator = () => {
  const { theme } = useTheme();

  return (
    <RootTabs.Navigator
      tabBarOptions={{
        activeTintColor: theme.primary,
        inactiveTintColor: theme.secondary,
        labelStyle: {
          fontSize: 10,
          marginBottom: 10,
          fontFamily: 'Mulish-Medium',
        },
      }}
      initialRouteName={'WorkoutTab'}
      screenOptions={{
        headerShown: false,
      }}>
      <RootTabs.Screen
        name={'WorkoutTab'}
        component={WorkoutsNavigator}
        options={{
          tabBarLabel: 'WORKOUT',
          tabBarIcon: ({ color }) => (
            <Image
              source={Images.workout}
              style={[TAB_ICON_STYLE, { tintColor: color }]}
            />
          ),
        }}
      />

      {/*<RootTabs.Screen*/}
      {/*  name={ 'MyJourneyTab' }*/}
      {/*  component={ VerySimpleView }*/}
      {/*  options={ {*/}
      {/*    tabBarLabel: 'MY JOURNEY',*/}
      {/*    tabBarIcon: ( { color } ) => <Image source={ Images.progress }*/}
      {/*                                        style={ [ TAB_ICON_STYLE, { tintColor: color } ] }/>,*/}
      {/*  } }/>*/}
      <RootTabs.Screen
        name={'FundamentalTab'}
        component={FundamentalsNavigator}
        options={{
          tabBarLabel: 'FUNDAMENTALS',
          tabBarIcon: ({ color }) => (
            <Image
              source={Images.fundamentals}
              style={[TAB_ICON_STYLE, { tintColor: color }]}
            />
          ),
        }}
      />

      <RootTabs.Screen
        name={'ProfileTab'}
        component={ProfileNavigator}
        options={{
          tabBarLabel: 'PROFILE',
          tabBarIcon: ({ color }) => (
            <Image
              source={Images.profile}
              style={[TAB_ICON_STYLE, { tintColor: color }]}
            />
          ),
        }}
      />
    </RootTabs.Navigator>
  );
};
