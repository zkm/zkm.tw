import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const FadeInSection = styled.div<{ delay?: number }>`
  opacity: 0;
  animation: ${fadeIn} 0.6s ease-out forwards;
  animation-delay: ${({ delay = 0 }) => delay}s;
`;

export default FadeInSection;
