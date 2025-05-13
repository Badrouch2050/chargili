import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  Paper
} from '@mui/material';
import { SupportTicket, TicketStatus } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SupportTicketViewProps {
  open: boolean;
  onClose: () => void;
  ticket: SupportTicket;
  onRespond: () => void;
}

const getStatusColor = (status: TicketStatus) => {
  switch (status) {
    case 'OUVERT':
      return 'error';
    case 'EN_COURS':
      return 'warning';
    case 'RESOLU':
      return 'success';
    case 'FERME':
      return 'default';
    default:
      return 'default';
  }
};

const SupportTicketView: React.FC<SupportTicketViewProps> = ({
  open,
  onClose,
  ticket,
  onRespond
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Détails du ticket</Typography>
          <Chip
            label={ticket.statut}
            color={getStatusColor(ticket.statut)}
            size="small"
          />
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3}>
          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Informations utilisateur
            </Typography>
            <Typography variant="body1">
              {ticket.user.nom} ({ticket.user.email})
            </Typography>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Sujet
            </Typography>
            <Typography variant="body1">{ticket.sujet}</Typography>
          </Paper>

          <Paper variant="outlined" sx={{ p: 2 }}>
            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
              Message initial
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {ticket.message}
            </Typography>
            <Typography variant="caption" color="textSecondary" display="block" mt={1}>
              Envoyé le {format(new Date(ticket.dateCreation), 'dd/MM/yyyy HH:mm', { locale: fr })}
            </Typography>
          </Paper>

          {ticket.reponse && (
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'action.hover' }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Réponse
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {ticket.reponse}
              </Typography>
              {ticket.dateResolution && (
                <Typography variant="caption" color="textSecondary" display="block" mt={1}>
                  Répondu le {format(new Date(ticket.dateResolution), 'dd/MM/yyyy HH:mm', { locale: fr })}
                </Typography>
              )}
            </Paper>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
        {ticket.statut !== 'FERME' && (
          <Button onClick={onRespond} variant="contained" color="primary">
            Répondre
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SupportTicketView; 