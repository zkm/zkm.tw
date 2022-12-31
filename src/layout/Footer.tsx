import React from 'react';

export type FooterProps = {
  // props for the Footer component
};

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <sup>&copy;</sup> 2005 &ndash; {currentYear}
    </footer>
  );
};

export default Footer;
