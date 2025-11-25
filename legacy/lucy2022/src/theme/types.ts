import {ColorValue} from "react-native";

export interface ColorTheme {
  primary: ColorValue;
  onPrimary: ColorValue;

  secondary: ColorValue;
  onSecondary: ColorValue;

  error: ColorValue;
  onError: ColorValue;

  danger: ColorValue;
  onDanger: ColorValue;

  background: ColorValue;
  onBackground: ColorValue;

  surface: ColorValue;
  onSurface: ColorValue;

  card: ColorValue;
  onCard: ColorValue;

  link: ColorValue;
  text: ColorValue;
  textMuted: ColorValue;
  invertedText: ColorValue;
  normalText: ColorValue;
  headerText: ColorValue;
  border: ColorValue;
  borderLight: ColorValue;
  muted10: ColorValue;
  muted20: ColorValue;
  muted30: ColorValue;
  muted50: ColorValue;
  muted: ColorValue;
  ultraMuted: ColorValue;
  test: ColorValue;
  faintBrand: ColorValue;
  activeNavTint: ColorValue;
  inactiveNavTint: ColorValue;
  activeDot: ColorValue;
  inactiveDot: ColorValue;
  cellBorder: ColorValue;
  ultralightPurple: ColorValue;
  steelPurple: ColorValue;
  placeholderColor: ColorValue;
  videoControlIcon: ColorValue;
  // buttons
  // buttonTop: ColorValue;
  // buttonBottom: ColorValue;
  // buttonDisabledTop: ColorValue;
  // buttonDisabledBottom: ColorValue;
}

export type ColorThemeKey = keyof ColorTheme;
