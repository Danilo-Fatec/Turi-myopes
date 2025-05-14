import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Inicio from '../tabs/Inicio';
import Mapa from '../tabs/Mapa';
import Dados from '../tabs/Dados';
import QuemSomos from '../tabs/QuemSomos';

const AppRoutes: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/mapa" element={<Mapa />} />
        <Route path="/dados" element={<Dados />} />
        <Route path="/quem-somos" element={<QuemSomos />} />
        <Route path="*" element={<h1>Página não encontrada</h1>} />
      </Routes>
  );
};

export default AppRoutes;