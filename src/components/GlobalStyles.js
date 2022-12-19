import { createGlobalStyle } from 'styled-components';
import css from '@styled-system/css';

const GlobalStyles = createGlobalStyle`
  html, body, #root {
    ${css({
      height: '100%',
    })}
}  
body {
    ${css({
      fontSize: '16px',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
      color: '#fff',
      backgroundColor: '#282c34',
      lineHeight: 1.15,
      fontSmoothing: 'antialiased',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: 0,
      marginBottom: 0,
    })}
  }
  a {
    ${css({
      color: '#5990f7',
      textDecoration: 'none',
    })}
  }
  a:hover {
    ${css({
      textDecoration: 'underline',
    })}
  }
  h1 {
    ${css({
      margin: 0,
      fontSize: '2.7rem',
    })}
  }
  #root {
    ${css({
      display: 'flex',
      userSelect: 'none',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    })}
  }

main {
  ${css({
    maxWidth: '800px',
    textAlign: 'center',
  })}
}

.main-logo img {
  ${css({
    borderRadius: '50%',
    maxWidth: '100%',
    height: 'auto',
  })}
}
.main-connect ul {
  ${css({
    listStyle: 'none',
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: '1em',
    padding: 0,
  })}
}
.main-connect ul > li {
  ${css({
    display: 'inline-block',
    marginLeft: '0.5em',
  })}
}
.main-connect ul > li:before {
  ${css({
    paddingLeft: 0,
    paddRight: '10px',
    paddingTop: 0,
    paddingBottom: 0,
  })}
}
.main-connect ul a {
  ${css({
    alignItems: 'center',
    background: '#5990f7',
    borderRadius: '50%',
    color: '#000',
    display: 'flex',
    justifyContent: 'center',
    padding: 0,
    textDecoration: 'none',
    transition: 'transform 0.15s ease-in-out',
    height: '3rem',
    width: '3rem',
  })}
}
.main-connect .screen-reader-text {
  ${css({
    border: 0,
    clip: 'rect(1px, 1px, 1px, 1px)',
    clipPath: 'inset(50%)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    width: '1px',
    wordWrap: 'normal',
    wordBreak: 'normal',
  })}
}`;

export default GlobalStyles;
