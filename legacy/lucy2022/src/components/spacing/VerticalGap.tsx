import React, { FC } from 'react';
import { View } from 'react-native';
import { SPACE_UNIT } from "../../theme";

interface Props {
  gap?: number;
}

export const VerticalGap: FC<Props> = ({ gap = 1 }) => {
  return <View style={{ marginVertical: gap * SPACE_UNIT }} />;
};
