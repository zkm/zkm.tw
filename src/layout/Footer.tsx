import React from 'react';

export default class Footer extends React.Component {
  render() {
    const currentYear = new Date().getFullYear();
    return (
      <footer>
        <sup>&copy;</sup> 2005 &ndash; {currentYear}
      </footer>
    );
  }
}
