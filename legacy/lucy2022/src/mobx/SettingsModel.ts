import { types } from 'mobx-state-tree';
import {ThemeMode} from "../theme/ThemeProvider";

export const SettingsModel = types
  .model('Settings', {
    themeMode: types.union(types.literal("dark"), types.literal("light")),
  })
  .actions((self) => {
    return {
      setThemeMode(mode: ThemeMode){
        self.themeMode = mode;
      }
    };
  });
