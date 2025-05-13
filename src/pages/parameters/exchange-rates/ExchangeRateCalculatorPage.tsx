import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Alert,
  Grid,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { calculateConversion } from './services/exchangeRateService';

const supportedCurrencies = ['TND', 'EUR', 'USD', 'GBP', 'AED', 'SAR', 'QAR', 'KWD', 'BHD', 'OMR'];

const ExchangeRateCalculatorPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    montant: 0,
    deviseSource: 'TND',
    deviseCible: 'EUR'
  });
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    try {
      setLoading(true);
      setError(null);
      const calculated = await calculateConversion(formData);
      setResult(calculated);
    } catch (err) {
      setError('Erreur lors du calcul de la conversion');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/parameters/exchange-rates')}
        >
          Retour
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Calculateur de conversion
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Montant"
              type="number"
              value={formData.montant}
              onChange={(e) => setFormData({ ...formData, montant: Number(e.target.value) })}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Devise Source"
              value={formData.deviseSource}
              onChange={(e) => setFormData({ ...formData, deviseSource: e.target.value })}
            >
              {supportedCurrencies.map((currency) => (
                <MenuItem key={currency} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              fullWidth
              label="Devise Cible"
              value={formData.deviseCible}
              onChange={(e) => setFormData({ ...formData, deviseCible: e.target.value })}
            >
              {supportedCurrencies.map((currency) => (
                <MenuItem key={currency} value={currency}>
                  {currency}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleCalculate}
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Calculer'}
            </Button>
          </Grid>
          {result !== null && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                <Typography variant="h6" align="center">
                  Résultat : {result.toFixed(2)} {formData.deviseCible}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default ExchangeRateCalculatorPage; 