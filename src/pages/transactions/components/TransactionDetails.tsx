import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { TransactionDetails, TransactionStatusUpdate } from '../types';
import transactionService from '../services/transactionService';

const TransactionDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState<TransactionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<TransactionStatusUpdate>({
    statut: 'EN_ATTENTE',
    commentaire: ''
  });

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      if (!id) return;
      try {
        const data = await transactionService.getTransactionDetails(parseInt(id, 10));
        setTransaction(data);
      } catch (err) {
        const error = err as Error;
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactionDetails();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!id) return;
    try {
      const updatedTransaction = await transactionService.updateTransactionStatus(
        parseInt(id, 10),
        newStatus
      );
      setTransaction(updatedTransaction);
      setOpenStatusDialog(false);
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    }
  };

  const getStatusColor = (statut: string) => {
    switch (statut) {
      case 'VALIDEE':
        return 'success';
      case 'EN_ATTENTE':
        return 'warning';
      case 'ECHOUEE':
        return 'error';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!transaction) {
    return (
      <Alert severity="warning" sx={{ m: 2 }}>
        Transaction non trouvée
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Détails de la Transaction
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenStatusDialog(true)}
        >
          Mettre à jour le statut
        </Button>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Informations de base */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Informations de base
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Numéro
                </Typography>
                <Typography>{transaction.numero}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Statut
                </Typography>
                <Chip
                  label={transaction.statut}
                  color={getStatusColor(transaction.statut)}
                  size="small"
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Type de traitement
                </Typography>
                <Typography>{transaction.typeTraitement}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Date de demande
                </Typography>
                <Typography>
                  {new Date(transaction.dateDemande).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* Informations financières */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Informations financières
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Montant
                </Typography>
                <Typography>
                  {transaction.montant.toLocaleString()} {transaction.devisePaiement}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Frais
                </Typography>
                <Typography>
                  {transaction.fraisConversion.toLocaleString()} {transaction.devisePaiement}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Opérateur
                </Typography>
                <Typography>{transaction.operateur}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Pays
                </Typography>
                <Typography>{transaction.pays}</Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* Informations client */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Informations client
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  Nom
                </Typography>
                <Typography>{transaction.clientNom || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  Email
                </Typography>
                <Typography>{transaction.clientEmail || 'N/A'}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="textSecondary">
                  Téléphone
                </Typography>
                <Typography>{transaction.client?.telephone || 'N/A'}</Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* Informations du client */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Informations du client
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Nom du client
                </Typography>
                <Typography>{transaction.clientNom}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                  Email du client
                </Typography>
                <Typography>{transaction.clientEmail}</Typography>
              </Grid>
            </Grid>
          </Grid>

          {/* Historique des statuts */}
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Historique des statuts
            </Typography>
            <Grid container spacing={2}>
              {transaction.historiqueStatuts?.map((historique, index) => (
                <Grid item xs={12} key={index}>
                  <Paper sx={{ p: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Date
                        </Typography>
                        <Typography>
                          {new Date(historique.date).toLocaleDateString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Statut
                        </Typography>
                        <Chip
                          label={historique.statut}
                          color={getStatusColor(historique.statut)}
                          size="small"
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Commentaire
                        </Typography>
                        <Typography>{historique.commentaire || 'Aucun commentaire'}</Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Dialog pour la mise à jour du statut */}
      <Dialog open={openStatusDialog} onClose={() => setOpenStatusDialog(false)}>
        <DialogTitle>Mettre à jour le statut</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              select
              fullWidth
              label="Nouveau statut"
              value={newStatus.statut}
              onChange={(e) => setNewStatus({ ...newStatus, statut: e.target.value as any })}
              SelectProps={{
                native: true
              }}
            >
              <option value="VALIDEE">Validée</option>
              <option value="EN_ATTENTE">En attente</option>
              <option value="ECHOUEE">Échouée</option>
            </TextField>
            <TextField
              fullWidth
              label="Commentaire"
              multiline
              rows={4}
              value={newStatus.commentaire}
              onChange={(e) => setNewStatus({ ...newStatus, commentaire: e.target.value })}
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenStatusDialog(false)}>Annuler</Button>
          <Button onClick={handleStatusUpdate} variant="contained" color="primary">
            Mettre à jour
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TransactionDetailsPage; 