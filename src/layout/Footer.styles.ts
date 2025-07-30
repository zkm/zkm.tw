import styled from 'styled-components';

export const FooterContainer = styled.footer`
  width: 100%;
  padding: 1.5rem 0;
  text-align: center;
`;

export const FooterText = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1rem;
  margin: 0;
  opacity: 0.8;
`;