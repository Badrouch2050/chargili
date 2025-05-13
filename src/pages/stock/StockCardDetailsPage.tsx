import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Divider,
  Card,
  CardContent
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getStockCardDetails } from './services/stockCardService';
import { StockCard } from './types/stockCard';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const StockCardDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [card, setCard] = useState<StockCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        if (!id) return;
        const data = await getStockCardDetails(parseInt(id));
        setCard(data);
        setError(null);
      } catch (err) {
        setError('Erreur lors du chargement des détails de la carte');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCardDetails();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !card) {
    return (
      <Box p={3}>
        <Alert severity="error">{error || 'Carte non trouvée'}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/stock-cartes')}
          sx={{ mt: 2 }}
        >
          Retour à la liste
        </Button>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate('/stock-cartes')}
        sx={{ mb: 2 }}
      >
        Retour à la liste
      </Button>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Détails de la carte
            </Typography>
            <Chip
              label={card.statut}
              color={card.statut === 'DISPONIBLE' ? 'success' : 'error'}
              sx={{ mb: 2 }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Informations de base
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Code
                    </Typography>
                    <Typography variant="body1">{card.code}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Opérateur
                    </Typography>
                    <Typography variant="body1">{card.operateur}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Montant
                    </Typography>
                    <Typography variant="body1">{card.montant} €</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Pays
                    </Typography>
                    <Typography variant="body1">{card.pays}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Date d'ajout
                    </Typography>
                    <Typography variant="body1">
                      {format(new Date(card.dateAjout), 'dd/MM/yyyy HH:mm', { locale: fr })}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Date d'utilisation
                    </Typography>
                    <Typography variant="body1">
                      {card.dateUtilisation
                        ? format(new Date(card.dateUtilisation), 'dd/MM/yyyy HH:mm', { locale: fr })
                        : '-'}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {card.utilisePourTransaction && (
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Transaction associée
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        ID Transaction
                      </Typography>
                      <Typography variant="body1">
                        {card.utilisePourTransaction.id}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Statut
                      </Typography>
                      <Typography variant="body1">
                        {card.utilisePourTransaction.statut}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Montant
                      </Typography>
                      <Typography variant="body1">
                        {card.utilisePourTransaction.montant} {card.utilisePourTransaction.devisePaiement}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Numéro cible
                      </Typography>
                      <Typography variant="body1">
                        {card.utilisePourTransaction.numeroCible}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="subtitle2" color="textSecondary">
                        Client
                      </Typography>
                      <Typography variant="body1">
                        {card.utilisePourTransaction.user.nom} ({card.utilisePourTransaction.user.email})
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Agent
                      </Typography>
                      <Typography variant="body1">
                        {card.utilisePourTransaction.agent.nom} ({card.utilisePourTransaction.agent.email})
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Date de demande
                      </Typography>
                      <Typography variant="body1">
                        {format(new Date(card.utilisePourTransaction.dateDemande), 'dd/MM/yyyy HH:mm', { locale: fr })}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Date de traitement
                      </Typography>
                      <Typography variant="body1">
                        {card.utilisePourTransaction.dateTraitement
                          ? format(new Date(card.utilisePourTransaction.dateTraitement), 'dd/MM/yyyy HH:mm', { locale: fr })
                          : '-'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Box>
  );
};

export default StockCardDetailsPage; 