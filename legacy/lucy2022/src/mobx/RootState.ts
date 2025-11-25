import { onSnapshot, types } from 'mobx-state-tree';
import * as XLogger from '../services/XLogger';
import { DebugStateModel } from './DebugState';
import { UIStateModel } from './UIModel';
import Reactotron from "reactotron-react-native";
import {AuthModel} from "./AuthModel";

export const RootStateModel = types
  .model('Root', {
    // persisted settings for debug (and more maybe eventually),
    appSettings: '',
    debug: DebugStateModel,
    ui: UIStateModel,
    auth: AuthModel,
  })
  .actions((_self) => {
    return {
      hello() {
        console.log('dude');
      },
    };
  })
  .views((_self) => ({
    get release() {
      return 'hello';
    },
  }));

export const rootState = RootStateModel.create({
  debug: DebugStateModel.create({}),
  ui: UIStateModel.create(),
  auth: AuthModel.create()
});

onSnapshot(rootState, (snapshot) => {
  XLogger.logSilly('[RootState] Snapshot');
  XLogger.logSilly(JSON.stringify(snapshot));
});

Reactotron.trackMstNode!(rootState);
