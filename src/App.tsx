import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Provider, useDispatch } from 'react-redux';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import { store } from './store/store';
import LoginPage from './pages/auth/LoginPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import UnauthorizedPage from './pages/errors/UnauthorizedPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import { getToken } from './services/auth/tokenService';
import { restoreAuth } from './store/slices/authSlice';
import AgentsList from './pages/agents/AgentsList';
import ClientsRoutes from './pages/clients';
import TransactionsPage from './pages/transactions';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import TransactionPage from './pages/transactions/TransactionPage';
import TransactionDetailsPage from './pages/transactions/TransactionDetailsPage';

// Composant pour gérer l'initialisation de l'authentification
const AuthInitializer: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = getToken();
    if (token) {
      // Ici, vous pourriez faire une requête pour vérifier le token
      // et récupérer les informations de l'utilisateur
      // Pour l'instant, on suppose que le token est valide
      dispatch(restoreAuth({
        email: 'admin@example.com', // À remplacer par les vraies données
        role: 'ADMIN'
      }));
    }
  }, [dispatch]);

  return null;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Router>
            <AuthInitializer />
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <DashboardPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/agents"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AgentsList />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clients/*"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ClientsRoutes />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <TransactionPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/transactions/:id"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <TransactionDetailsPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <DashboardPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
