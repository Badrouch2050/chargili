import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Switch,
  FormControlLabel
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HistoryIcon from '@mui/icons-material/History';
import { getExchangeRate, toggleExchangeRate, ExchangeRate } from './services/exchangeRateService';

const ExchangeRateDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [rate, setRate] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        setLoading(true);
        const data = await getExchangeRate(Number(id));
        setRate(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement du taux de change');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
  }, [id]);

  const handleToggle = async () => {
    if (!rate) return;

    try {
      const updatedRate = await toggleExchangeRate(rate.id);
      setRate(updatedRate);
      setError(null);
    } catch (err) {
      setError('Erreur lors de la modification du statut');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!rate) {
    return (
      <Box p={3}>
        <Alert severity="error">Taux de change non trouvé</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/parameters/exchange-rates')}
        >
          Retour
        </Button>
        <Button
          startIcon={<HistoryIcon />}
          onClick={() => navigate(`/parameters/exchange-rates/${id}/history`)}
        >
          Historique
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Détails du taux de change
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Devise Source
            </Typography>
            <Typography variant="body1">
              {rate.deviseSource}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Devise Cible
            </Typography>
            <Typography variant="body1">
              {rate.deviseCible}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Taux
            </Typography>
            <Typography variant="body1">
              {rate.taux.toFixed(4)}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Date d'obtention
            </Typography>
            <Typography variant="body1">
              {new Date(rate.dateObtention).toLocaleString()}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={rate.actif}
                  onChange={handleToggle}
                  color="primary"
                />
              }
              label={rate.actif ? 'Actif' : 'Inactif'}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ExchangeRateDetailsPage; 