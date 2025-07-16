import React from 'react';
import ConnectLinks from '../components/ConnectLinks/ConnectLinks';
import styled from 'styled-components';
import FadeInSection from '../components/ui/FadeInSection';

const TitleText = styled.h2`
  color: ${({ theme }) => theme.text};
  font-size: 1.5rem;
  margin-bottom: 0.25em;
  font-weight: normal;
  height: 100%;
  text-align: center;
`;

const RoleText = styled.p`
  font-size: 1.1rem;
  font-weight: 300;
  margin-top: 0.25em;
  margin-bottom: 1em;
  color: ${({ theme }) => theme.text};
  text-align: center;
`;

export type BodyProps = {
  title?: string;
};

const Body: React.FC<BodyProps> = ({ title = '' }) => {
  return (
    <>
      <FadeInSection delay={0}>
        <TitleText>{title}</TitleText>
      </FadeInSection>
      <FadeInSection delay={0.1}>
        <RoleText>Software Engineer · Builder · Coffee-First Human</RoleText>
      </FadeInSection>
      <FadeInSection delay={0.2}>
        <ConnectLinks />
      </FadeInSection>
    </>
  );
};

export default Body;
