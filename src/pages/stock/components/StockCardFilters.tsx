import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Grid,
  Paper,
  Typography
} from '@mui/material';

interface StockCardFiltersProps {
  filters: {
    operateur: string;
    pays: string;
    statut: string;
  };
  onFilterChange: (name: string, value: string) => void;
}

const operateurs = ['Orange', 'Free', 'SFR', 'Bouygues'];
const pays = ['France', 'Belgique', 'Suisse', 'Luxembourg'];
const statuts = ['DISPONIBLE', 'UTILISE'];

const StockCardFilters: React.FC<StockCardFiltersProps> = ({ filters, onFilterChange }) => {
  const handleFilterChange = (name: string, value: string) => {
    // Si la valeur est vide, on envoie une chaîne vide pour réinitialiser le filtre
    onFilterChange(name, value || '');
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" gutterBottom>
        Filtres
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            select
            fullWidth
            label="Opérateur"
            value={filters.operateur}
            onChange={(e) => handleFilterChange('operateur', e.target.value)}
          >
            <MenuItem value="">Tous</MenuItem>
            {operateurs.map((operateur) => (
              <MenuItem key={operateur} value={operateur}>
                {operateur}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            select
            fullWidth
            label="Pays"
            value={filters.pays}
            onChange={(e) => handleFilterChange('pays', e.target.value)}
          >
            <MenuItem value="">Tous</MenuItem>
            {pays.map((pays) => (
              <MenuItem key={pays} value={pays}>
                {pays}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            select
            fullWidth
            label="Statut"
            value={filters.statut}
            onChange={(e) => handleFilterChange('statut', e.target.value)}
          >
            <MenuItem value="">Tous</MenuItem>
            {statuts.map((statut) => (
              <MenuItem key={statut} value={statut}>
                {statut}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default StockCardFilters; 