import Reactotron, { networking } from 'reactotron-react-native';
import { name } from '../../../app.json';
import { CustomCommands } from './ReactotronCustomCommands';
import * as XLogger from '../../services/XLogger';
import { mst } from 'reactotron-mst';
import { rootState } from "../../mobx/RootState";

// Note: removed fucked up monkey patching bullshit in favor of Xlogger
export const configureReactotron = () => {
  console.log('configureReactotron: configuring Reactotron');
  const opts = { name: `${name}` };

  Reactotron.configure(opts)
    .useReactNative()
    // the google bit gets rid of the constant firestore pings from Reactotron
    .use(
      networking({
        ignoreContentTypes: /^(image|video)\/.*$/i,
        ignoreUrls: /\bgoogle\b/,
      })
    )
    .use(mst())
    .connect();

  if (CustomCommands) {
    CustomCommands.forEach((c) => Reactotron.onCustomCommand(c));
  }

  // Let's clear Reactotron on every time we load the app
  Reactotron.clear!();
  XLogger.setUseReactotron(true);

};
