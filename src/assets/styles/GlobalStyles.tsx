// src/assets/styles/GlobalStyles.tsx
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  /* === Reset & Box Model === */
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html, body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
    scroll-behavior: smooth;
  }

  /* === Body Styling === */
  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 1rem;
    line-height: 1.5;
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  /* === Typography === */
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    font-weight: 600;
    line-height: 1.25;
    color: ${({ theme }) => theme.text};
  }

  h1 {
    font-size: 2.7rem;
  }

  p {
    margin: 0;
  }

  /* === Links === */
  a {
    color: ${({ theme }) => theme.accent};
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover,
  a:focus {
    text-decoration: underline;
    outline: none;
  }

  a:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 2px;
  }

  /* === Root Container === */
  #root {
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    height: 100%;
  }

  /* === Accessibility === */
  [tabindex='-1']:focus {
    outline: none;
  }

  ::selection {
    background: ${({ theme }) => theme.accent}33;
    color: ${({ theme }) => theme.text};
  }
  
  /* === Buttons === */
  button {
    font: inherit;
    background-color: ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.background};
    border: none;
    padding: 0.5em 1em;
    border-radius: 0.375rem;
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease, transform 0.1s ease;
  }

  button:hover {
    background-color: ${({ theme }) => theme.accent}cc;
  }

  button:active {
    transform: scale(0.98);
  }

  button:focus {
    outline: none;
  }

  button:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 2px;
  }

  button:disabled {
    background-color: #ccc;
    color: #666;
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  /* === SVG Icons === */
  .svg-icon {
    width: 1.5rem;
    height: 1.5rem;
    fill: currentColor;
    flex-shrink: 0;
    vertical-align: middle;
  }


`;

export default GlobalStyles as unknown as React.FC;
