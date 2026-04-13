import { MD3LightTheme } from 'react-native-paper';

export const iPracticomColors = {
  electricBlue:  '#0075DB',
  skyBlue:       '#2EB4FF',
  darkNavy:      '#181D24',
  midGray:       '#757D86',
  white:         '#FFFFFF',
  lightBG:       '#F4FBFF',
  gradientStart: '#2EB4FF',
  gradientEnd:   '#0075DB',
  success:       '#22C55E',
  error:         '#EF4444',
};

export const iPracticomRadius = {
  card:   12,
  button: 8,
  badge:  20,
  input:  8,
};

export const iPracticomSpacing = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
};

export const iPracticomElevation = {
  card: 2, modal: 8, fab: 4,
};

export const iPracticomMD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary:          '#0075DB',
    onPrimary:        '#FFFFFF',
    primaryContainer: '#F4FBFF',
    secondary:        '#2EB4FF',
    onSecondary:      '#FFFFFF',
    background:       '#F4FBFF',
    surface:          '#FFFFFF',
    onSurface:        '#181D24',
    outline:          '#757D86',
    error:            '#EF4444',
  },
};
