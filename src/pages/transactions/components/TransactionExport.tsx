import React, { useState } from 'react';
import {
  Box,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  CircularProgress,
  Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Download as DownloadIcon } from '@mui/icons-material';
import { TransactionFilter } from '../types';
import transactionService from '../services/transactionService';

interface TransactionExportProps {
  onExport: (filter: TransactionFilter) => void;
}

const TransactionExport: React.FC<TransactionExportProps> = ({ onExport }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportFilter, setExportFilter] = useState<TransactionFilter>({
    format: 'CSV'
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setError(null);
    setExportFilter({ format: 'CSV' });
  };

  const handleChange = (field: keyof TransactionFilter, value: any) => {
    setExportFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    try {
      await transactionService.exportTransactions(exportFilter);
      handleClose();
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<DownloadIcon />}
        onClick={handleOpen}
      >
        Exporter
      </Button>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Exporter les transactions</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              {/* Format d'export */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Format d'export</InputLabel>
                  <Select
                    value={exportFilter.format || 'CSV'}
                    onChange={(e) => handleChange('format', e.target.value)}
                    label="Format d'export"
                  >
                    <MenuItem value="CSV">CSV</MenuItem>
                    <MenuItem value="EXCEL">Excel</MenuItem>
                    <MenuItem value="PDF">PDF</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Statut */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Statut</InputLabel>
                  <Select
                    value={exportFilter.statut || ''}
                    onChange={(e) => handleChange('statut', e.target.value)}
                    label="Statut"
                  >
                    <MenuItem value="">Tous</MenuItem>
                    <MenuItem value="VALIDEE">Validée</MenuItem>
                    <MenuItem value="EN_ATTENTE">En attente</MenuItem>
                    <MenuItem value="ECHOUEE">Échouée</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Type de traitement */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Type de traitement</InputLabel>
                  <Select
                    value={exportFilter.typeTraitement || ''}
                    onChange={(e) => handleChange('typeTraitement', e.target.value)}
                    label="Type de traitement"
                  >
                    <MenuItem value="">Tous</MenuItem>
                    <MenuItem value="AUTOMATIQUE">Automatique</MenuItem>
                    <MenuItem value="MANUELLE">Manuelle</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Période */}
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Date de début"
                  value={exportFilter.dateDebut ? new Date(exportFilter.dateDebut) : null}
                  onChange={(date) => handleChange('dateDebut', date?.toISOString())}
                  slotProps={{
                    textField: { fullWidth: true }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <DatePicker
                  label="Date de fin"
                  value={exportFilter.dateFin ? new Date(exportFilter.dateFin) : null}
                  onChange={(date) => handleChange('dateFin', date?.toISOString())}
                  slotProps={{
                    textField: { fullWidth: true }
                  }}
                />
              </Grid>

              {/* Nom du fichier */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nom du fichier"
                  value={exportFilter.nomFichier || ''}
                  onChange={(e) => handleChange('nomFichier', e.target.value)}
                  placeholder="transactions_export"
                />
              </Grid>
            </Grid>

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Annuler</Button>
          <Button
            onClick={handleExport}
            variant="contained"
            color="primary"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <DownloadIcon />}
          >
            Exporter
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TransactionExport; 