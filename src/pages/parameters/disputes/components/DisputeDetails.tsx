import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Grid,
  Chip,
  Divider
} from '@mui/material';
import { Dispute } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DisputeDetailsProps {
  dispute: Dispute | null;
  open: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const formatAmount = (amount: number, currency: string) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'OUVERT':
      return 'error';
    case 'EN_COURS':
      return 'warning';
    case 'RESOLU':
      return 'success';
    case 'REMBOURSE':
      return 'info';
    case 'REJETE':
      return 'default';
    default:
      return 'default';
  }
};

const DisputeDetails: React.FC<DisputeDetailsProps> = ({
  dispute,
  open,
  onClose,
  onUpdate
}) => {
  if (!dispute) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Détails du litige #{dispute.id}
          </Typography>
          <Chip
            label={dispute.statut}
            color={getStatusColor(dispute.statut)}
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              Transaction
            </Typography>
            <Box mt={1}>
              <Typography variant="body1">
                ID: #{dispute.transaction.id}
              </Typography>
              <Typography variant="body1">
                Montant: {formatAmount(dispute.transaction.montant, dispute.transaction.devisePaiement)}
              </Typography>
              <Typography variant="body1">
                Statut: {dispute.transaction.statut}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              Utilisateur
            </Typography>
            <Box mt={1}>
              <Typography variant="body1">
                Nom: {dispute.user.nom}
              </Typography>
              <Typography variant="body1">
                Email: {dispute.user.email}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="textSecondary">
              Détails du litige
            </Typography>
            <Box mt={1}>
              <Typography variant="body1">
                Motif: {dispute.motif}
              </Typography>
              <Typography variant="body1">
                Commentaire: {dispute.commentaire}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Divider />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Date de création
            </Typography>
            <Typography variant="body1">
              {format(new Date(dispute.dateCreation), 'dd/MM/yyyy HH:mm', { locale: fr })}
            </Typography>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Date de résolution
            </Typography>
            <Typography variant="body1">
              {dispute.dateResolution
                ? format(new Date(dispute.dateResolution), 'dd/MM/yyyy HH:mm', { locale: fr })
                : 'Non résolu'}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
        <Button
          onClick={onUpdate}
          variant="contained"
          color="primary"
          disabled={dispute.statut === 'REJETE'}
        >
          Mettre à jour le statut
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DisputeDetails; 