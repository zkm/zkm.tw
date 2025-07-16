import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../theme/ThemeContext';

const ToggleButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: ${({ theme }) => theme.accent};
  color: ${({ theme }) => theme.text};
  border: none;
  border-radius: 999px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;

  &:hover,
  &:focus-visible {
    filter: brightness(1.1);
    outline: none;
  }
`;

const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <ToggleButton onClick={toggleTheme} aria-label="Toggle dark/light mode">
      {mode === 'light' ? '🌙 Dark' : '☀️ Light'}
    </ToggleButton>
  );
};

export default ThemeToggle;
