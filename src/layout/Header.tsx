import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const MainTitle = styled.h1`
  margin: 0;
  font-size: 2.7rem;
  color: #fff;
  font-weight: normal;
  text-align: center;
`;

const MainLogo = styled.img`
  border-radius: 50%;
  max-width: 100%;
  height: auto;
`;

export interface HeaderProps {
  name: string;
  logo?: string;
}

const Header: React.FC<HeaderProps> = ({ name, logo }) => {
  return (
    <div>
      <MainTitle>{name}</MainTitle>
      <p><MainLogo src={logo} alt={name} srcSet={logo} width={500} height={500}></MainLogo></p>
    </div>
  );
};

Header.propTypes = {
  name: PropTypes.string.isRequired,
  logo: PropTypes.string,
};

export default Header;
