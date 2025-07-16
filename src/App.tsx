import React from 'react';
import GlobalStyles from './assets/styles/GlobalStyles';
import Tracking from './components/tracking/Tracking';
import Header from './layout/Header';
import Body from './layout/Body';
import Footer from './layout/Footer';
import logo from './assets/icons/logo.webp';
import styled from 'styled-components';
import ThemeToggle from './components/ui/ThemeToggle';
import { motion } from 'framer-motion';

const MainSection = styled.main.attrs({
  id: 'main-content',
})`
  max-width: 800px;
  text-align: center;
`;

const App: React.FC = () => {
  return (
    <>
      <GlobalStyles />
      <Tracking />
      <ThemeToggle />
      <MainSection>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Header name="Zach Schneider" logo={logo} />
        </motion.div>
        <Body title="Stay in Touch" />
        <Footer />
      </MainSection>
    </>
  );
};

export default App;
