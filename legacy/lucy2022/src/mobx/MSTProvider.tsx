import React, { createContext, FC, useContext } from 'react';
import { Instance } from 'mobx-state-tree';
import { rootState, RootStateModel } from './RootState';
import { WithChildren } from '../types/common';

export type MSTRootInstance = Instance<typeof RootStateModel>;
export const StoreContext = createContext<MSTRootInstance | null>(null);
const MProvider = StoreContext.Provider;

export const MSTProvider = ({ children }: WithChildren) => (
  <MProvider value={rootState}>{children}</MProvider>
);


