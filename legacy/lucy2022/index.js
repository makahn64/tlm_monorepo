import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import { setUseReactotron } from './src/services/XLogger';

setUseReactotron(__DEV__);
AppRegistry.registerComponent(appName, () => App);
