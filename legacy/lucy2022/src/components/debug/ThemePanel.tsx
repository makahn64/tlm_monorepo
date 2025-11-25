import React, {FC} from 'react';
import {useTheme} from "../../theme/ThemeProvider";
import {Text, View} from "react-native";
import {ColorThemeKey} from "../../theme/types";

export const ThemePanel = () => {
  const {theme, themeMode} = useTheme();

  const keys = Object.keys(theme) as ColorThemeKey[];

  // @ts-ignore
  return (
    <View>
      <Text>{themeMode}</Text>
      <View style={{ flex:1, flexDirection: 'row', flexWrap: 'wrap'}}>
        {keys.map(k => (
          <View
            key={k}
            style={{minHeight: 40, backgroundColor: theme[k], padding: 10, margin: 10}}>
            <Text>{k}</Text>
          </View>
        ))
        }
      </View>
    </View>
  );
};
