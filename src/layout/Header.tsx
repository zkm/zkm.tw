// Header.tsx
import React from 'react';
import PropTypes from 'prop-types';
import { MainTitle, MainLogo, Tagline } from './Header.styles';

export interface HeaderProps {
  name: string;
  logo?: string;
}

const Header: React.FC<HeaderProps> = ({ name, logo }) => {
  return (
    <div>
      <MainTitle>{name}</MainTitle>
      <Tagline>Creative technologist crafting user-friendly digital experiences.</Tagline>
      <div role="img" aria-label={`${name} profile image`}>
        <MainLogo src={logo} alt={`${name} profile logo`} loading="lazy" />
      </div>
    </div>
  );
};

Header.propTypes = {
  name: PropTypes.string.isRequired,
  logo: PropTypes.string,
};

export default Header;
