import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';   // Importar el componente de Home
import History from './pages/History';  // Importar el componente History

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />  {/* Ruta principal */}
      <Route path="/history" element={<History />} />  {/* Ruta para historial */}
    </Routes>
  );
}

export default App;
