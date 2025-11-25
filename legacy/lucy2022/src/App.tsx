import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';
import { MSTProvider } from './mobx/MSTProvider';
import {configureReactotron} from "./tools/reactotron/ReactotronConfig";
import * as XLogger from './services/XLogger';
import {UIProvider} from "./providers/UIProvider";
import {ThemeProvider} from "./theme/ThemeProvider";
import {ThemePanel} from "./components/debug/ThemePanel";
import {ColdScreen, HotScreen} from "./components/debug/PlaceholderScreen";
import {RootNavigator} from "./navigation/RootNavigator";

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  configureReactotron();

  XLogger.logInfo('App Starting');
  XLogger.logDebug('Booting');

  return (
    <MSTProvider>
      <ThemeProvider>
        <UIProvider>
            <RootNavigator />
        </UIProvider>
      </ThemeProvider>
    </MSTProvider>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "400",
  },
  highlight: {
    fontWeight: "700",
  },
});

export default App;
