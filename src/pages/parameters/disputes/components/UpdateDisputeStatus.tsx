import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  Typography,
  Alert
} from '@mui/material';
import { Dispute, DisputeStatus, UpdateDisputeStatusDto } from '../types';
import { updateDisputeStatus } from '../services/disputeService';

interface UpdateDisputeStatusProps {
  dispute: Dispute | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const UpdateDisputeStatus: React.FC<UpdateDisputeStatusProps> = ({
  dispute,
  open,
  onClose,
  onSuccess
}) => {
  const [status, setStatus] = useState<DisputeStatus>(dispute?.statut || 'OUVERT');
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!dispute) return;

    try {
      setLoading(true);
      setError(null);

      const data: UpdateDisputeStatusDto = {
        statut: status,
        commentaire: comment
      };

      await updateDisputeStatus(dispute.id, data);
      onSuccess();
      onClose();
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!dispute) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        Mettre à jour le statut du litige #{dispute.id}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box mt={2}>
          <TextField
            select
            label="Nouveau statut"
            value={status}
            onChange={(e) => setStatus(e.target.value as DisputeStatus)}
            fullWidth
            required
          >
            <MenuItem value="OUVERT">Ouvert</MenuItem>
            <MenuItem value="EN_COURS">En cours</MenuItem>
            <MenuItem value="RESOLU">Résolu</MenuItem>
            <MenuItem value="REMBOURSE">Remboursé</MenuItem>
            <MenuItem value="REJETE">Rejeté</MenuItem>
          </TextField>
        </Box>

        <Box mt={2}>
          <TextField
            label="Commentaire"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            multiline
            rows={4}
            placeholder="Ajoutez un commentaire pour expliquer le changement de statut..."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Annuler
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading || status === dispute.statut}
        >
          {loading ? 'Mise à jour...' : 'Mettre à jour'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateDisputeStatus; 