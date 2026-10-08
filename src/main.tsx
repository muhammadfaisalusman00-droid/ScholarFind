import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const globalAdsterraScripts = [
  'https://pl31710101.profitableratecpmnetwork.com/33/b8/81/33b881d39f05b10f5b3531797238e146.js',
  'https://pl31710104.profitableratecpmnetwork.com/29/65/8d/29658d4c29090106b0ab672a8fc063d2.js',
];

globalAdsterraScripts.forEach((src) => {
  if (document.querySelector(`script[src="${src}"]`)) return;

  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.head.appendChild(script);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
