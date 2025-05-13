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
import { SupportTicket, TicketStatus } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface SupportTicketListProps {
  tickets: SupportTicket[];
  onRespond: (ticket: SupportTicket) => void;
  onView: (ticket: SupportTicket) => void;
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

const SupportTicketList: React.FC<SupportTicketListProps> = ({
  tickets,
  onRespond,
  onView
}) => {
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Utilisateur</TableCell>
            <TableCell>Sujet</TableCell>
            <TableCell>Message</TableCell>
            <TableCell>Statut</TableCell>
            <TableCell>Date de création</TableCell>
            <TableCell>Date de résolution</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>
                <Box>
                  <Typography variant="body2">{ticket.user.nom}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {ticket.user.email}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>{ticket.sujet}</TableCell>
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
                  {ticket.message}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={ticket.statut}
                  color={getStatusColor(ticket.statut)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                {format(new Date(ticket.dateCreation), 'dd/MM/yyyy HH:mm', { locale: fr })}
              </TableCell>
              <TableCell>
                {ticket.dateResolution
                  ? format(new Date(ticket.dateResolution), 'dd/MM/yyyy HH:mm', { locale: fr })
                  : '-'}
              </TableCell>
              <TableCell>
                <Box display="flex" gap={1}>
                  <Tooltip title="Voir les détails">
                    <IconButton
                      size="small"
                      onClick={() => onView(ticket)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Répondre">
                    <IconButton
                      size="small"
                      onClick={() => onRespond(ticket)}
                      disabled={ticket.statut === 'FERME'}
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

export default SupportTicketList; 