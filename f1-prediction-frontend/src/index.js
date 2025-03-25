import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Home from './pages/Home'; // ⬅️ Cambiado desde App
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);

reportWebVitals();
