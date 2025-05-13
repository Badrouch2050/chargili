import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Divider
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { SupportTicket, RespondTicketDto, TicketStatus } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface RespondTicketFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: RespondTicketDto) => Promise<void>;
  ticket: SupportTicket;
}

const statusOptions: TicketStatus[] = ['EN_COURS', 'RESOLU', 'FERME'];

const RespondTicketForm: React.FC<RespondTicketFormProps> = ({
  open,
  onClose,
  onSubmit,
  ticket
}) => {
  const { control, handleSubmit, reset } = useForm<RespondTicketDto>({
    defaultValues: {
      reponse: '',
      statut: 'EN_COURS'
    }
  });

  React.useEffect(() => {
    if (ticket) {
      reset({
        reponse: '',
        statut: ticket.statut === 'OUVERT' ? 'EN_COURS' : ticket.statut
      });
    }
  }, [ticket, reset]);

  const handleFormSubmit = async (data: RespondTicketDto) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Répondre au ticket</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Utilisateur
              </Typography>
              <Typography variant="body1">
                {ticket.user.nom} ({ticket.user.email})
              </Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Sujet
              </Typography>
              <Typography variant="body1">{ticket.sujet}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Message
              </Typography>
              <Typography variant="body1">{ticket.message}</Typography>
            </Box>

            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Date de création
              </Typography>
              <Typography variant="body1">
                {format(new Date(ticket.dateCreation), 'dd/MM/yyyy HH:mm', { locale: fr })}
              </Typography>
            </Box>

            <Divider />

            <Controller
              name="reponse"
              control={control}
              rules={{ required: 'La réponse est requise' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Réponse"
                  multiline
                  rows={4}
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                />
              )}
            />

            <Controller
              name="statut"
              control={control}
              rules={{ required: 'Le statut est requis' }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <InputLabel>Nouveau statut</InputLabel>
                  <Select {...field} label="Nouveau statut">
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained" color="primary">
            Envoyer la réponse
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default RespondTicketForm; 