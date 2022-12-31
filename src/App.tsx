import React from 'react';
import ThemeProvider from './components/ThemeProvider';
import Header, { HeaderProps } from './layout/Header';
import Body, { BodyProps } from './layout/Body';
import Footer, { FooterProps } from './layout/Footer';
import links from './data/links';

import logo from './assets/logo.webp';
import TagManager from 'react-gtm-module';

interface AppProps {
  gtmId: string;
}

const initializeTagManager = (gtmId: string) => {
  React.useEffect(() => {
    TagManager.initialize({ gtmId });
  }, []);
};

const App: React.FC<AppProps> = ({ gtmId }) => {
  initializeTagManager(gtmId);

  const headerProps: HeaderProps = {
    name: 'Zach Schneider',
    logo,
  };

  const bodyProps: BodyProps = {
    title: 'Stay in Touch',
    links,
  };

  const footerProps: FooterProps = {};

  return (
    <ThemeProvider>
      <main>
        <Header {...headerProps} />
        <Body {...bodyProps} />
        <Footer {...footerProps} />
      </main>
    </ThemeProvider>
  );
};

App.defaultProps = {
  gtmId: 'GTM-KTW7DXZ',
};

export default App;
