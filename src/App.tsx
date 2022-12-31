import React from 'react';
import GlobalStyles from './components/GlobalStyles';
import Tracking from './components/Tracking';
import Header from './layout/Header';
import Body from './layout/Body';
import Footer from './layout/Footer';
import logo from './assets/logo.webp';
import styled from 'styled-components';

const MainSection = styled.main`
  max-width: 800px;
  text-align: center;
`;

const App: React.FC = () => {
  return (
    <>
      <GlobalStyles />
      <Tracking />
      <MainSection>
        <Header name="Zach Schneider" logo={logo} />
        <Body title="Stay in Touch" />
        <Footer startYear={2005} />
      </MainSection>
    </>
  );
};

export default App;
