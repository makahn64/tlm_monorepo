import React from 'react';
import {ColorValue, View, Text} from "react-native";

interface BaseProps {
  color: ColorValue;
  title: string;
}

export const PlaceholderScreen = ({ title, color }: BaseProps  ) => {

  return (
    <View style={{ backgroundColor: color, flex: 1, justifyContent: 'center'}}>
      <Text style={{ color: 'white', textAlign: 'center', fontSize: 30}}>{title}</Text>
    </View>
  );
};

export const HotScreen = () => <PlaceholderScreen color="red" title="HOT" />
export const ColdScreen = () => <PlaceholderScreen color="blue" title="COLD" />
