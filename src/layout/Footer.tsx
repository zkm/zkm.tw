import React from 'react';
import { FooterContainer, FooterText } from './Footer.styles';

const Footer: React.FC = () => {

  return (
    <FooterContainer as="footer">
      <FooterText>&copy; {new Date().getFullYear()} Zach Schneider, All rights reserved</FooterText>
    </FooterContainer>
  );
};

export default Footer;
