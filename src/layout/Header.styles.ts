import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    scale: 0.95;
  }
  to {
    opacity: 1;
    scale: 1;
  }
`;

export const MainTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 0.25rem;
  color: ${({ theme }) => theme.text};
  text-shadow: 1px 1px 2px ${({ theme }) => theme.accent}66;
  animation: ${fadeInUp} 0.5s ease-out both;
`;

export const Tagline = styled.p`
  font-size: 1.125rem;
  font-weight: 400;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.text}cc;
  animation: ${fadeInUp} 0.6s ease-out 0.1s both;
`;

export const MainLogo = styled.img`
  width: clamp(160px, 25vw, 300px);
  height: clamp(160px, 25vw, 300px);
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 0 20px ${({ theme }) => theme.accent}40,
              0 4px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: ${fadeIn} 0.7s ease-out 0.2s both;

  &:hover {
    transform: scale(1.03);
    box-shadow: 0 0 25px ${({ theme }) => theme.accent}88,
                0 6px 16px rgba(0, 0, 0, 0.25);
  }
`;
