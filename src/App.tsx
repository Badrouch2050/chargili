import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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
import StockCardPage from './pages/stock/StockCardPage';
import StockCardDetailsPage from './pages/stock/StockCardDetailsPage';
import RechargeStockPage from './pages/stock/RechargeStockPage';
import ExchangeRatePage from './pages/parameters/exchange-rates/ExchangeRatePage';
import ExchangeRateDetailsPage from './pages/parameters/exchange-rates/ExchangeRateDetailsPage';
import ExchangeRateHistoryPage from './pages/parameters/exchange-rates/ExchangeRateHistoryPage';
import ExchangeRateCalculatorPage from './pages/parameters/exchange-rates/ExchangeRateCalculatorPage';
import CurrencyPage from './pages/parameters/currency/CurrencyPage';
import MainCurrencyPage from './pages/parameters/main-currency/MainCurrencyPage';
import OperatorsPage from './pages/parameters/operators/OperatorsPage';
import CommissionsPage from './pages/parameters/commissions/CommissionsPage';
import SupportTicketsPage from './pages/parameters/support-tickets/SupportTicketsPage';
import DisputesPage from './pages/parameters/disputes/DisputesPage';

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

// Composant pour gérer les routes avec navigation
const AppRoutes: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  return (
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
        path="/stock/cards"
        element={
          <ProtectedRoute>
            <MainLayout>
              <StockCardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/stock-cartes"
        element={
          <ProtectedRoute>
            <MainLayout>
              <StockCardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/stock-cartes/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <StockCardDetailsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/stock/balance"
        element={
          <ProtectedRoute>
            <MainLayout>
              <RechargeStockPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/parameters/exchange-rates"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ExchangeRatePage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/parameters/currency"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CurrencyPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/parameters/exchange-rates/calculator"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ExchangeRateCalculatorPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/parameters/exchange-rates/:id/history"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ExchangeRateHistoryPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/parameters/exchange-rates/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ExchangeRateDetailsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/parameters/main-currency"
        element={
          <ProtectedRoute>
            <MainLayout>
              <MainCurrencyPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/parameters/operators"
        element={
          <ProtectedRoute>
            <MainLayout>
              <OperatorsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/parameters/commissions"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CommissionsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/parameters/support-tickets"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SupportTicketsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/parameters/disputes"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DisputesPage />
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
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Router>
            <AuthInitializer />
            <AppRoutes />
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
