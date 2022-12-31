import React from 'react';
import ConnectLinks from '../components/ConnectLinks';
import styled from 'styled-components';

const TitleText = styled.h2`
  color: white;
  font-size: 1.5rem;
  margin-bottom: 0.25em;
  font-weight: normal;
  height: 100%;
  text-align: center;
`;

export type BodyProps = {
  title: string;
};

const Body: React.FC<BodyProps> = ({ title }) => {
  return (
    <>
      <TitleText>{title}</TitleText>
      <ConnectLinks />
    </>
  );
};

Body.defaultProps = {
  title: '',
};

export default Body;
