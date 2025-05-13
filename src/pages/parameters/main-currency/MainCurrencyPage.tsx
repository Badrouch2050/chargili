import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MainCurrencyList from './components/MainCurrencyList';
import MainCurrencyForm from './components/MainCurrencyForm';
import { MainCurrency, CreateMainCurrencyDto, UpdateMainCurrencyDto } from './types';
import {
  getMainCurrencies,
  createMainCurrency,
  updateMainCurrency
} from './services/mainCurrencyService';

const MainCurrencyPage: React.FC = () => {
  const [currencies, setCurrencies] = useState<MainCurrency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<MainCurrency | undefined>();

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMainCurrencies();
      setCurrencies(data);
    } catch (err) {
      setError('Erreur lors du chargement des devises principales');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const handleCreate = async (data: CreateMainCurrencyDto) => {
    try {
      await createMainCurrency(data);
      await fetchCurrencies();
    } catch (err) {
      setError('Erreur lors de la création de la devise principale');
      throw err;
    }
  };

  const handleUpdate = async (data: UpdateMainCurrencyDto) => {
    if (!editingCurrency) return;
    try {
      await updateMainCurrency(editingCurrency.id, data);
      await fetchCurrencies();
    } catch (err) {
      setError('Erreur lors de la modification de la devise principale');
      throw err;
    }
  };

  const handleEdit = (currency: MainCurrency) => {
    setEditingCurrency(currency);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCurrency(undefined);
  };

  const handleSubmit = async (data: CreateMainCurrencyDto | UpdateMainCurrencyDto) => {
    if (editingCurrency) {
      await handleUpdate(data);
    } else {
      await handleCreate(data as CreateMainCurrencyDto);
    }
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
        <Typography variant="h4">Devises Principales</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsFormOpen(true)}
        >
          Nouvelle devise
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <MainCurrencyList
          currencies={currencies}
          onEdit={handleEdit}
          onRefresh={fetchCurrencies}
        />
      </Paper>

      <MainCurrencyForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleSubmit}
        editingCurrency={editingCurrency}
      />
    </Box>
  );
};

export default MainCurrencyPage; 