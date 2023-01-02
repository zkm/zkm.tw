import React from 'react';
import PropTypes from 'prop-types';
import { MainTitle, MainLogo } from './Header.styles';

export interface HeaderProps {
  name: string;
  logo?: string;
}

const Header: React.FC<HeaderProps> = ({ name, logo }) => {
  return (
    <div>
      <MainTitle>{name}</MainTitle>
      <p>
        <MainLogo src={logo} alt={name} srcSet={logo} width={500} height={500}></MainLogo>
      </p>
    </div>
  );
};

Header.propTypes = {
  name: PropTypes.string.isRequired,
  logo: PropTypes.string,
};

export default Header;
