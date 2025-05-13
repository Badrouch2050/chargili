import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CommissionList from './components/CommissionList';
import CommissionForm from './components/CommissionForm';
import { Commission, CreateCommissionDto, UpdateCommissionDto, CommissionFilter, CommissionType } from './types';
import {
  getCommissions,
  createCommission,
  updateCommission
} from './services/commissionService';
import { getAllOperators } from '../operators/services/operatorService';

const CommissionsPage: React.FC = () => {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [operators, setOperators] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCommission, setEditingCommission] = useState<Commission | undefined>();
  const [filters, setFilters] = useState<CommissionFilter>({});

  const fetchCommissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCommissions(filters);
      setCommissions(data);
    } catch (err) {
      setError('Erreur lors du chargement des commissions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOperators = async () => {
    try {
      const data = await getAllOperators();
      setOperators(data.map(op => op.nom));
    } catch (err) {
      console.error('Erreur lors du chargement des opérateurs:', err);
    }
  };

  useEffect(() => {
    fetchCommissions();
    fetchOperators();
  }, [filters]);

  const handleCreate = async (data: CreateCommissionDto) => {
    try {
      await createCommission(data);
      await fetchCommissions();
    } catch (err) {
      setError('Erreur lors de la création de la commission');
      throw err;
    }
  };

  const handleUpdate = async (data: UpdateCommissionDto) => {
    if (!editingCommission) return;
    try {
      await updateCommission(editingCommission.id, data);
      await fetchCommissions();
    } catch (err) {
      setError('Erreur lors de la modification de la commission');
      throw err;
    }
  };

  const handleEdit = (commission: Commission) => {
    setEditingCommission(commission);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingCommission(undefined);
  };

  const handleSubmit = async (data: CreateCommissionDto | UpdateCommissionDto) => {
    if (editingCommission) {
      await handleUpdate(data);
    } else {
      await handleCreate(data as CreateCommissionDto);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Commissions</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsFormOpen(true)}
        >
          Nouvelle commission
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Filtrer par pays"
              name="pays"
              value={filters.pays || ''}
              onChange={handleFilterChange}
              fullWidth
            >
              <MenuItem value="">Tous les pays</MenuItem>
              {Array.from(new Set(commissions.map(c => c.pays))).map(pays => (
                <MenuItem key={pays} value={pays}>
                  {pays}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Filtrer par opérateur"
              name="operateur"
              value={filters.operateur || ''}
              onChange={handleFilterChange}
              fullWidth
            >
              <MenuItem value="">Tous les opérateurs</MenuItem>
              <MenuItem value="null">Global (sans opérateur)</MenuItem>
              {operators.map(operator => (
                <MenuItem key={operator} value={operator}>
                  {operator}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Filtrer par type"
              name="typeCommission"
              value={filters.typeCommission || ''}
              onChange={handleFilterChange}
              fullWidth
            >
              <MenuItem value="">Tous les types</MenuItem>
              <MenuItem value="POURCENTAGE">Pourcentage</MenuItem>
              <MenuItem value="FIXE">Fixe</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        <CommissionList
          commissions={commissions}
          onEdit={handleEdit}
          onRefresh={fetchCommissions}
        />
      </Paper>

      <CommissionForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleSubmit}
        editingCommission={editingCommission}
        operators={operators}
      />
    </Box>
  );
};

export default CommissionsPage; 