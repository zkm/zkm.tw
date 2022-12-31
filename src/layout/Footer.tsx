import React from 'react';
import styled from 'styled-components';

interface FooterProps {
  startYear: number;
}

const FooterText = styled.div`
  color: white;
  font-size: 1rem;
  font-weight: normal;
  height: 100%;
  margin-bottom: .25em;
  text-align: center;
`;

const Footer: React.FC<FooterProps> = ({ startYear }) => {
  const currentYear = new Date().getFullYear();
  return (
    <footer>
      <FooterText>
        <sup>&copy;</sup> {startYear} &ndash; {currentYear}
      </FooterText>
    </footer>
  );
};

export default Footer;
