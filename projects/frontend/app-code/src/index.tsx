import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

type Root = Element | DocumentFragment;

const root = ReactDOM.createRoot(document.getElementById('root') as Root);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

reportWebVitals();
