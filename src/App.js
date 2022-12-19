import React from 'react';
import ThemeProvider from './components/ThemeProvider';
import Header from './layout/Header';
import Body from './layout/Body';
import Footer from './layout/Footer';
import logo from './assets/logo.webp';
import TagManager from 'react-gtm-module';

class App extends React.Component {
  componentDidMount() {
    const tagManagerArgs = {
      gtmId: 'GTM-KTW7DXZ',
    };
    TagManager.initialize(tagManagerArgs);
  }

  render() {
    return (
      <ThemeProvider>
        <main>
          <Header name="Zach Schneider" logo={logo}></Header>
          <Body title="Stay in Touch"></Body>
          <Footer />
        </main>
      </ThemeProvider>
    );
  }
}

export default App;
