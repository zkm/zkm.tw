import React from 'react';
import PropTypes from 'prop-types';

export interface HeaderProps {
  name: string;
  logo?: string;
}

const Header: React.FC<HeaderProps> = ({ name, logo }) => {
  return (
    <div>
      <h1>{name}</h1>
      <p className="main-logo">
        <img src={logo} alt={name} srcSet={logo} width={500} height={500} />
      </p>
    </div>
  );
};

Header.propTypes = {
  name: PropTypes.string.isRequired,
  logo: PropTypes.string,
};

export default Header;
