import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body {
    height: 100%;
  }

  body {
    font-size: 1rem;
    font-family: 'system-ui', sans-serif;
    color: #fff;
    background-color: #282c34;
    line-height: 1.15;
    font-smoothing: antialiased;
    margin: 0;
  }

  a {
    color: #5990f7;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  h1 {
    margin: 0;
    font-size: 2.7rem;
  }

  #root {
    display: flex;
    user-select: none;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
`;

export default GlobalStyles;
