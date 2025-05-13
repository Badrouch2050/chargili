import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import OperatorList from './components/OperatorList';
import OperatorForm from './components/OperatorForm';
import { Operator, CreateOperatorDto, UpdateOperatorDto, OperatorFilter } from './types';
import {
  getOperators,
  createOperator,
  updateOperator
} from './services/operatorService';

const OperatorsPage: React.FC = () => {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOperator, setEditingOperator] = useState<Operator | undefined>();
  const [filters, setFilters] = useState<OperatorFilter>({});

  const fetchOperators = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOperators(filters);
      setOperators(data);
    } catch (err) {
      setError('Erreur lors du chargement des opérateurs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperators();
  }, [filters]);

  const handleCreate = async (data: CreateOperatorDto) => {
    try {
      await createOperator(data);
      await fetchOperators();
    } catch (err) {
      setError('Erreur lors de la création de l\'opérateur');
      throw err;
    }
  };

  const handleUpdate = async (data: UpdateOperatorDto) => {
    if (!editingOperator) return;
    try {
      await updateOperator(editingOperator.id, data);
      await fetchOperators();
    } catch (err) {
      setError('Erreur lors de la modification de l\'opérateur');
      throw err;
    }
  };

  const handleEdit = (operator: Operator) => {
    setEditingOperator(operator);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingOperator(undefined);
  };

  const handleSubmit = async (data: CreateOperatorDto | UpdateOperatorDto) => {
    if (editingOperator) {
      await handleUpdate(data);
    } else {
      await handleCreate(data as CreateOperatorDto);
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
        <Typography variant="h4">Opérateurs</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setIsFormOpen(true)}
        >
          Nouvel opérateur
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          select
          label="Filtrer par pays"
          name="pays"
          value={filters.pays || ''}
          onChange={handleFilterChange}
          fullWidth
        >
          <MenuItem value="">Tous les pays</MenuItem>
          {Array.from(new Set(operators.map(op => op.pays))).map(pays => (
            <MenuItem key={pays} value={pays}>
              {pays}
            </MenuItem>
          ))}
        </TextField>
      </Paper>

      <Paper>
        <OperatorList
          operators={operators}
          onEdit={handleEdit}
          onRefresh={fetchOperators}
        />
      </Paper>

      <OperatorForm
        open={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleSubmit}
        editingOperator={editingOperator}
      />
    </Box>
  );
};

export default OperatorsPage; 