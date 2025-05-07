import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Clear as ClearIcon } from '@mui/icons-material';
import { TransactionFilter } from '../types';

interface TransactionFiltersProps {
  onFilter: (filters: TransactionFilter) => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({ onFilter }) => {
  const [filters, setFilters] = useState<TransactionFilter>({});

  const handleChange = (field: keyof TransactionFilter, value: any) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({});
    onFilter({});
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Filtres
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Statut */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Statut</InputLabel>
              <Select
                value={filters.statut || ''}
                onChange={(e) => handleChange('statut', e.target.value)}
                label="Statut"
              >
                <MenuItem value="VALIDEE">Validée</MenuItem>
                <MenuItem value="EN_ATTENTE">En attente</MenuItem>
                <MenuItem value="ECHOUEE">Échouée</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Type de traitement */}
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Type de traitement</InputLabel>
              <Select
                value={filters.typeTraitement || ''}
                onChange={(e) => handleChange('typeTraitement', e.target.value)}
                label="Type de traitement"
              >
                <MenuItem value="AUTOMATIQUE">Automatique</MenuItem>
                <MenuItem value="MANUELLE">Manuelle</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Opérateur */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Opérateur"
              value={filters.operateur || ''}
              onChange={(e) => handleChange('operateur', e.target.value)}
            />
          </Grid>

          {/* Pays */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Pays"
              value={filters.pays || ''}
              onChange={(e) => handleChange('pays', e.target.value)}
            />
          </Grid>

          {/* ID Agent */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="ID Agent"
              type="number"
              value={filters.agentId || ''}
              onChange={(e) => handleChange('agentId', e.target.value ? parseInt(e.target.value) : undefined)}
            />
          </Grid>

          {/* Date de début */}
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Date de début"
              value={filters.dateDebut ? new Date(filters.dateDebut) : null}
              onChange={(date) => handleChange('dateDebut', date?.toISOString())}
              slotProps={{
                textField: { fullWidth: true },
                actionBar: {
                  actions: ['clear']
                }
              }}
            />
          </Grid>

          {/* Date de fin */}
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Date de fin"
              value={filters.dateFin ? new Date(filters.dateFin) : null}
              onChange={(date) => handleChange('dateFin', date?.toISOString())}
              slotProps={{
                textField: { fullWidth: true },
                actionBar: {
                  actions: ['clear']
                }
              }}
            />
          </Grid>

          {/* Montant minimum */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Montant minimum"
              type="number"
              value={filters.montantMin || ''}
              onChange={(e) => handleChange('montantMin', e.target.value ? parseFloat(e.target.value) : undefined)}
              InputProps={{
                endAdornment: filters.montantMin && (
                  <IconButton
                    size="small"
                    onClick={() => handleChange('montantMin', undefined)}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )
              }}
            />
          </Grid>

          {/* Montant maximum */}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Montant maximum"
              type="number"
              value={filters.montantMax || ''}
              onChange={(e) => handleChange('montantMax', e.target.value ? parseFloat(e.target.value) : undefined)}
              InputProps={{
                endAdornment: filters.montantMax && (
                  <IconButton
                    size="small"
                    onClick={() => handleChange('montantMax', undefined)}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                )
              }}
            />
          </Grid>

          {/* Boutons d'action */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleReset}
                startIcon={<ClearIcon />}
              >
                Réinitialiser
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                Appliquer les filtres
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default TransactionFilters; 