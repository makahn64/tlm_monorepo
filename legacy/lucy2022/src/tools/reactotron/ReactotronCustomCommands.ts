import * as XLogger from '../../services/XLogger';
import { rootState } from '../../mobx/RootState';
import {setThemeMode} from "../../theme/ThemeProvider";

interface RCC {
  command: string;
  title: string;
  description: string;
  handler: () => void | Promise<void>;
}

const ToggleIdBanner: RCC = {
  command: 'Toggle ID banner',
  title: 'Toggle ID banner',
  description: 'Toggles ID banner',
  handler: async () => {
    rootState.debug.setShowIdOverlay(!rootState.debug.showIdOverlay);
  },
};

const ToggleLoader: RCC = {
  command: 'ToggleLoader',
  title: 'Toggle loader',
  description: 'Toggles loader',
  handler: async () => {
    const { ui: { showLoader, hideLoader, isLoaderVisible } } = rootState;
    if (isLoaderVisible) {
      hideLoader()
    } else {
      showLoader('Loading...');
    }
  },
};

const ToggleFlower: RCC = {
  command: 'ToggleFlower',
  title: 'Toggle flower',
  description: 'Toggles flower',
  handler: async () => {
    const { ui: { showFlower, hideFlower, isFlowerVisible } } = rootState;
    if (isFlowerVisible) {
      hideFlower()
    } else {
      showFlower('Loading...');
    }
  },
};

const DarkTheme: RCC = {
  command: 'DarkTheme',
  title: 'Dark theme',
  description: 'Dark theme',
  handler:  () => {
   setThemeMode('dark');
  },
};
const LightTheme: RCC = {
  command: 'LightTheme',
  title: 'LightTheme theme',
  description: 'LightTheme theme',
  handler:  () => {
    setThemeMode('light');
  },
};

const ToggleAuth: RCC = {
  command: 'ToggleAuth',
  title: 'Toggle auth',
  description: 'Toggle auth',
  handler:  () => {
    const { auth: {isLoggedIn, setIsLoggedIn } } = rootState;

    setIsLoggedIn(!isLoggedIn);
  },
};


export const CustomCommands = [ToggleAuth, DarkTheme, LightTheme, ToggleLoader, ToggleFlower, ToggleIdBanner];
