// src/components/ui/IconLink.tsx
import React from 'react';
import styled from 'styled-components';

interface IconLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon: React.ReactNode;
  label: string;
  size?: number;
}

const StyledLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
  transition: color 0.2s ease;

  &:hover,
  &:focus {
    color: ${({ theme }) => theme.colors.accent};
    outline: none;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
    fill: currentColor;
  }
`;

const ScreenReaderText = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
`;

const IconLink: React.FC<IconLinkProps> = ({ icon, label, size = 24, ...props }) => (
  <StyledLink {...props} aria-label={label} title={label}>
    {icon}
    <ScreenReaderText>{label}</ScreenReaderText>
  </StyledLink>
);

export default IconLink;
