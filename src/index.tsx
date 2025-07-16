import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ThemeContextProvider } from './theme/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ThemeContextProvider>
      <App />
    </ThemeContextProvider>
  </React.StrictMode>,
);

reportWebVitals();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js') // Update this path if needed
      .then((registration) => {
        console.log('Service worker registered:', registration);
      })
      .catch((error) => {
        console.log('Service worker registration failed:', error);
      });
  });
}
