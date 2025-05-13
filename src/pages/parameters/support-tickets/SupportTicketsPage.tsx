import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SupportTicketList from './components/SupportTicketList';
import RespondTicketForm from './components/RespondTicketForm';
import SupportTicketView from './components/SupportTicketView';
import { SupportTicket, RespondTicketDto, TicketFilter, TicketStatus } from './types';
import { getTickets, respondToTicket } from './services/supportTicketService';

const SupportTicketsPage: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | undefined>();
  const [filters, setFilters] = useState<TicketFilter>({});

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTickets(filters);
      setTickets(data);
    } catch (err) {
      setError('Erreur lors du chargement des tickets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const handleView = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsViewOpen(true);
  };

  const handleViewClose = () => {
    setIsViewOpen(false);
    setSelectedTicket(undefined);
  };

  const handleRespond = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsFormOpen(true);
    setIsViewOpen(false);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedTicket(undefined);
  };

  const handleSubmit = async (data: RespondTicketDto) => {
    if (!selectedTicket) return;
    try {
      await respondToTicket(selectedTicket.id, data);
      await fetchTickets();
    } catch (err) {
      setError('Erreur lors de l\'envoi de la réponse');
      throw err;
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (name: string, value: Date | null) => {
    setFilters(prev => ({
      ...prev,
      [name]: value ? value.toISOString() : undefined
    }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        Tickets de Support
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Filtrer par statut"
              name="statut"
              value={filters.statut || ''}
              onChange={handleFilterChange}
              fullWidth
            >
              <MenuItem value="">Tous les statuts</MenuItem>
              <MenuItem value="OUVERT">Ouvert</MenuItem>
              <MenuItem value="EN_COURS">En cours</MenuItem>
              <MenuItem value="RESOLU">Résolu</MenuItem>
              <MenuItem value="FERME">Fermé</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Rechercher"
              name="search"
              value={filters.search || ''}
              onChange={handleFilterChange}
              fullWidth
              placeholder="Sujet ou message..."
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DatePicker
              label="Date de création début"
              value={filters.dateCreationStart ? new Date(filters.dateCreationStart) : null}
              onChange={(date) => handleDateChange('dateCreationStart', date)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DatePicker
              label="Date de création fin"
              value={filters.dateCreationEnd ? new Date(filters.dateCreationEnd) : null}
              onChange={(date) => handleDateChange('dateCreationEnd', date)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        <SupportTicketList
          tickets={tickets}
          onRespond={handleRespond}
          onView={handleView}
        />
      </Paper>

      {selectedTicket && (
        <>
          <SupportTicketView
            open={isViewOpen}
            onClose={handleViewClose}
            ticket={selectedTicket}
            onRespond={() => handleRespond(selectedTicket)}
          />
          <RespondTicketForm
            open={isFormOpen}
            onClose={handleFormClose}
            onSubmit={handleSubmit}
            ticket={selectedTicket}
          />
        </>
      )}
    </Box>
  );
};

export default SupportTicketsPage; 