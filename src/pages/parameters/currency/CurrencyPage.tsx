import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { getCurrencies } from './services/currencyService';
import { Currency } from './types';
import CurrencyList from './components/CurrencyList';
import CurrencyForm from './components/CurrencyForm';

const CurrencyPage: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      const data = await getCurrencies();
      setCurrencies(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des devises');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleOpenForm = () => {
    setEditingCurrency(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingCurrency(null);
  };

  const handleEdit = (currency: Currency) => {
    setEditingCurrency(currency);
    setOpenForm(true);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Gestion des Devises
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenForm}
        >
          Ajouter
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <CurrencyList
          currencies={currencies}
          onEdit={handleEdit}
          onRefresh={fetchCurrencies}
        />
      </Paper>

      <CurrencyForm
        open={openForm}
        onClose={handleCloseForm}
        onSuccess={fetchCurrencies}
        editingCurrency={editingCurrency}
      />
    </Box>
  );
};

export default CurrencyPage; 