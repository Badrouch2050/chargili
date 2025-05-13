import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Dispute, DisputeFilter, DisputeStatus } from './types';
import { getDisputes } from './services/disputeService';
import DisputeList from './components/DisputeList';
import DisputeDetails from './components/DisputeDetails';
import UpdateDisputeStatus from './components/UpdateDisputeStatus';

const DisputesPage: React.FC = () => {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DisputeFilter>({});
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDisputes(filters);
      setDisputes(data);
    } catch (err) {
      setError('Erreur lors du chargement des litiges');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, [filters]);

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

  const handleViewDispute = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setDetailsOpen(true);
  };

  const handleUpdateDispute = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setUpdateOpen(true);
  };

  const handleUpdateSuccess = () => {
    fetchDisputes();
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
        Gestion des Litiges
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
              <MenuItem value="REMBOURSE">Remboursé</MenuItem>
              <MenuItem value="REJETE">Rejeté</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={3}>
            <TextField
              label="Rechercher"
              name="search"
              value={filters.search || ''}
              onChange={handleFilterChange}
              fullWidth
              placeholder="Motif ou commentaire..."
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
        <DisputeList
          disputes={disputes}
          onView={handleViewDispute}
          onUpdate={handleUpdateDispute}
        />
      </Paper>

      <DisputeDetails
        dispute={selectedDispute}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        onUpdate={() => {
          setDetailsOpen(false);
          setUpdateOpen(true);
        }}
      />

      <UpdateDisputeStatus
        dispute={selectedDispute}
        open={updateOpen}
        onClose={() => setUpdateOpen(false)}
        onSuccess={handleUpdateSuccess}
      />
    </Box>
  );
};

export default DisputesPage; 