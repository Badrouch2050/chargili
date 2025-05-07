import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ClientList from './components/ClientList';
import ClientDetailsPage from './components/ClientDetails';

const ClientsRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ClientList />} />
      <Route path="/:id" element={<ClientDetailsPage />} />
    </Routes>
  );
};

export default ClientsRoutes; 