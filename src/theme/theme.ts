// src/theme/theme.ts
export const lightTheme = {
  colors: {
    background: '#ffffff',
    text: '#000000',
    accent: '#5990f7',
    icon: '#ffffff',
  },
};

export const darkTheme = {
  colors: {
    background: '#0d1117',
    text: '#c9d1d9',
    accent: '#1f6feb',
    icon: '#ffffff',
  },
};

// Define the theme structure
export type ThemeType = typeof lightTheme;
