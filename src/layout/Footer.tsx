import React from 'react';
import { FooterContainer, FooterText } from './Footer.styles';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterText>&copy; {currentYear} Zach Schneider, All rights reserved</FooterText>
    </FooterContainer>
  );
};

export default Footer;
