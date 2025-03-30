import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';  // Asegúrate de tener un archivo App.jsx que contenga tus rutas.
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom"; // <-- IMPORTANTE

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>   {/* ENVUELVE TODA LA APLICACIÓN */}
      <App />          {/* Aquí cargas el componente principal que tendrá las rutas */}
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
