import React from 'react';
import PropTypes, { string } from 'prop-types';
import { ThemeProvider as StyledComponentsProvider } from 'styled-components';

import GlobalStyles from './GlobalStyles';


interface Palette {
  primary_100: string;
  primary_200: string;
  primary_300: string;
  primary_400: string;
  primary_500: string;
  primary_600: string;
  primary_700: string;
  primary_800: string;
  info_100: string;
  info_800: string;
  negative_100: string;
  negative_200: string;
  negative_500: string;
  negative_600: string;
  negative_700: string;
  negative_800: string;
  warning_100: string;
  warning_500: string;
  warning_600: string;
  warning_700: string;
  reward_200: string;
  reward_400: string;
  reward_500: string;
  neutral_100: string;
  neutral_200: string;
  neutral_300: string;
  neutral_400: string;
  neutral_500: string;
  neutral_700: string;
  neutral_800: string;
}

const palette: Palette = {
  primary_100: '#F6FD39',
  primary_200: '#E4FABF',
  primary_300: '#D2F895',
  primary_400: '#ABED0D',
  primary_500: '#00A846',
  primary_600: '#067A46',
  primary_700: '#056835',
  primary_800: '#035624',
  info_100: '#E9FAFF',
  info_800: '#00178C',
  negative_100: '#FFEAE9',
  negative_200: '#FFCCCA',
  negative_500: '#DB1D1D',
  negative_600: '#B30000',
  negative_700: '#970000',
  negative_800: '#7C0000',
  warning_100: '#FFECD3',
  warning_500: '#EF670A',
  warning_600: '#CE4500',
  warning_700: '#A43700',
  reward_200: '#FFFAB2',
  reward_400: '#FFE900',
  reward_500: '#E2C700',
  neutral_100: '#FFFFFF',
  neutral_200: '#F8F8F8',
  neutral_300: '#EEEEEE',
  neutral_400: '#E4E4E4',
  neutral_500: '#BBBBBB',
  neutral_700: '#676767',
  neutral_800: '#343434',
};

interface Breakpoints {
  xl: string;
  lg: string;
  md: string;
  sm: string;
}

const breakpoints: Breakpoints = {
  /** Above 1200 */
  xl: '1200px',
  /** Between 1024 and  1199 */
  lg: '1024px',
  /** Between 768 and  1023 */
  md: '768px',
  /** Below 767 */
  sm: '0px',
};

/**
 * Breakpoints as integers for styled-bootstrap-grid
 */
interface RawBreakpoints {
  xl: number;
  lg: number;
  md: number;
  sm: number;
}

export const rawBreakpoints: RawBreakpoints = {
  /** Above 1200 */
  xl: parseInt(breakpoints.xl, 10),
  /** Between 1024 and  1199 */
  lg: parseInt(breakpoints.lg, 10),
  /** Between 768 and  1023 */
  md: parseInt(breakpoints.md, 10),
  /** Below 767 */
  sm: parseInt(breakpoints.sm, 10),
};


/**
 * We use this array to set the breakpoints scale for styled-system.
 * we skip breakpoints.sm because styled-system already takes care of the initial breakpoint.
 * https://styled-system.com/#responsive-styles
 */
const BREAKPOINTS_SCALE = [breakpoints.md, breakpoints.lg, breakpoints.xl];

export interface MediaQueries {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export const theme = {
  colors: {
    ...palette,
    border: palette.neutral_400,
    background: palette.neutral_200,
    text: palette.neutral_800,
    black: palette.neutral_800,
    white: palette.neutral_100,
  },
  breakpoints: BREAKPOINTS_SCALE,
  // https://github.com/dragma/styled-bootstrap-grid#styled-bootstrap-grid
  grid: {
    /**
     * This version of styled-bootstrap-grid requires breakpoint
     * values to be integers (not px literals)
     */
    breakpoints: rawBreakpoints,
    container: {
      padding: {
        xl: 32,
        lg: 32,
        md: 16,
        sm: 16,
      },
      maxWidth: {
        xl: 1144,
        lg: 960,
        md: '100%',
        sm: '100%',
      },
    },
  },
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => (
  <StyledComponentsProvider theme={theme}>
    <GlobalStyles />
    {children}
  </StyledComponentsProvider>
);

ThemeProvider.propTypes = {
  children: PropTypes.any.isRequired,
};

export default ThemeProvider;
