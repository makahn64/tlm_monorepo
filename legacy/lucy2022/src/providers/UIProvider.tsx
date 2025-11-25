import React, { useContext, useState } from 'react';
import { View } from 'react-native';
import { WithChildren } from '../types/common';
import { observer } from 'mobx-react-lite';
import { useUI } from '../mobx/mobxHooks';
import {FullScreenLoader} from "../components/loaders/FullScreenLoader";
import {FlowerLoader} from "../components/loaders/FlowerLoader";


export const UIProvider = observer(({ children }: WithChildren) => {

  const ui = useUI();

  return (
    <View style={{ flex: 1}}>
      <FullScreenLoader />
      <FlowerLoader />
      {children}
    </View>
  );
});

