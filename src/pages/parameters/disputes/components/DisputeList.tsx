import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip,
  Box,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Dispute, DisputeStatus } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DisputeListProps {
  disputes: Dispute[];
  onView: (dispute: Dispute) => void;
  onUpdate: (dispute: Dispute) => void;
}

const getStatusColor = (status: DisputeStatus) => {
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

const formatAmount = (amount: number, currency: string) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

const DisputeList: React.FC<DisputeListProps> = ({
  disputes,
  onView,
  onUpdate
}) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Transaction</TableCell>
            <TableCell>Utilisateur</TableCell>
            <TableCell>Motif</TableCell>
            <TableCell>Commentaire</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Date de création</TableCell>
            <TableCell>Date de résolution</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {disputes.map((dispute) => (
            <TableRow key={dispute.id}>
              <TableCell>
                <Box>
                  <Typography variant="body2">
                    #{dispute.transaction.id}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {formatAmount(dispute.transaction.montant, dispute.transaction.devisePaiement)}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Box>
                  <Typography variant="body2">{dispute.user.nom}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {dispute.user.email}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{dispute.motif}</TableCell>
              <TableCell>
                <Typography
                  variant="body2"
                  sx={{
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {dispute.commentaire}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={dispute.statut}
                  color={getStatusColor(dispute.statut)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {format(new Date(dispute.dateCreation), 'dd/MM/yyyy HH:mm', { locale: fr })}
              </TableCell>
              <TableCell>
                {dispute.dateResolution
                  ? format(new Date(dispute.dateResolution), 'dd/MM/yyyy HH:mm', { locale: fr })
                  : '-'}
              </TableCell>
              <TableCell>
                <Box display="flex" gap={1}>
                  <Tooltip title="Voir les détails">
                    <IconButton
                      size="small"
                      onClick={() => onView(dispute)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Mettre à jour le statut">
                    <IconButton
                      size="small"
                      onClick={() => onUpdate(dispute)}
                      disabled={dispute.statut === 'REJETE'}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DisputeList; 