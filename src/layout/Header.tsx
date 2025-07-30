// Header.tsx
import React from 'react';
import { MainTitle, MainLogo, Tagline } from './Header.styles';

export interface HeaderProps {
  name: string;
  logo?: string;
}

const Header: React.FC<HeaderProps> = ({ name, logo }) => (
  <header>
    <MainTitle>{name}</MainTitle>
    <Tagline>Creative technologist crafting user-friendly digital experiences.</Tagline>
    {logo && (
      <div role="img" aria-label={`${name} profile image`}>
        <MainLogo src={logo} alt={`${name} profile logo`} loading="lazy" />
      </div>
    )}
  </header>
);

export default Header;