import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CalculateIcon from '@mui/icons-material/Calculate';
import { getExchangeRates, ExchangeRate } from './services/exchangeRateService';
import ExchangeRateList from './components/ExchangeRateList';
import ExchangeRateForm from './components/ExchangeRateForm';

const ExchangeRatePage: React.FC = () => {
  const navigate = useNavigate();
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openForm, setOpenForm] = useState(false);
  const [editingRate, setEditingRate] = useState<ExchangeRate | null>(null);

  const fetchExchangeRates = async () => {
    try {
      setLoading(true);
      const data = await getExchangeRates();
      setExchangeRates(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des taux de change');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRates();
  }, []);

  const handleOpenForm = () => {
    setEditingRate(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingRate(null);
  };

  const handleEdit = (rate: ExchangeRate) => {
    setEditingRate(rate);
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
          Taux de Change
        </Typography>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<CalculateIcon />}
            onClick={() => navigate('/parameters/exchange-rates/calculator')}
            sx={{ mr: 2 }}
          >
            Calculateur
          </Button>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenForm}
          >
            Ajouter
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper>
        <ExchangeRateList
          rates={exchangeRates}
          onEdit={handleEdit}
          onRefresh={fetchExchangeRates}
        />
      </Paper>

      <ExchangeRateForm
        open={openForm}
        onClose={handleCloseForm}
        onSuccess={fetchExchangeRates}
        editingRate={editingRate}
      />
    </Box>
  );
};

export default ExchangeRatePage; 