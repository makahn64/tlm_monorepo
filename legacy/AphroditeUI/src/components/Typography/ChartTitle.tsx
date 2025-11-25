import React, {CSSProperties, FC} from 'react';
import {THEME_COLORS} from "../../assets/styles/themecolors";

export const ChartTitle: FC = ({ children }) => {
  return (
    <div>
      <p style={styles.chartTitle}>{children}</p>
    </div>
  );
};

const styles = {
  chartTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: 'bold',
    color: THEME_COLORS.steelPurple
  } as CSSProperties
}
