import React, { FC } from 'react';

export enum GapSize {
  sm = 10,
  md = 20,
  lg = 30
}

interface OwnProps {
  gapSize: GapSize;
}

export const VerticalGap: FC<OwnProps> = ({ gapSize }) => (<div style={{marginTop: gapSize, marginBottom: gapSize}}/>);

