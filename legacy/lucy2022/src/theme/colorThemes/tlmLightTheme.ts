import { ColorTheme } from '../types';
import Colors, { brandPalette } from './colors';

export const colorTheme: ColorTheme = {
  primary: Colors.primary,
  faintBrand: brandPalette.irisLight,
  secondary: Colors.lightPurple,
  error: Colors.danger,
  danger: '#aa0000',
  background: Colors.white,
  surface: Colors.white,
  text: Colors.darkGray,
  textMuted: Colors.grey3,
  link: brandPalette.oceanLight,
  normalText: Colors.black,
  invertedText: Colors.white,
  headerText: Colors.grey2,
  placeholderColor: brandPalette.iris,
  test: '#ff0367',
  card: Colors.white,
  border: Colors.lightGray,
  borderLight: Colors.ultralightPurple,
  muted: Colors.lightGray,
  muted10: Colors.grey0,
  muted20: Colors.grey1,
  muted30: Colors.grey2,
  muted50: Colors.grey3,
  ultraMuted: Colors.ultralightGray,
  // nav
  activeDot: Colors.lightPurple1,
  inactiveDot: Colors.ultralightPurple,
  activeNavTint: Colors.darkPurple,
  inactiveNavTint: Colors.ultralightPurple,
  //
  cellBorder: Colors.mediumGreyBrown,
  ultralightPurple: Colors.ultralightPurple,
  steelPurple: Colors.lightPurple1,
  videoControlIcon: Colors.white,
  //
  //

  //
  onPrimary: Colors.white,
  onSecondary: Colors.white,
  onDanger: Colors.white,
  onBackground: Colors.ultralightGray,
  onSurface: Colors.ultralightGray,
  onCard: Colors.ultralightGray,
  onError: Colors.white,
};
