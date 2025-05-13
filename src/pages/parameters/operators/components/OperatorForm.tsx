import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Operator, CreateOperatorDto, UpdateOperatorDto, OperatorStatus } from '../types';

interface OperatorFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateOperatorDto | UpdateOperatorDto) => Promise<void>;
  editingOperator?: Operator;
}

const statusOptions: OperatorStatus[] = ['ACTIF', 'INACTIF'];

const OperatorForm: React.FC<OperatorFormProps> = ({
  open,
  onClose,
  onSubmit,
  editingOperator
}) => {
  const { control, handleSubmit, reset } = useForm<CreateOperatorDto>({
    defaultValues: {
      nom: editingOperator?.nom || '',
      pays: editingOperator?.pays || '',
      codeDetection: editingOperator?.codeDetection || '',
      statut: editingOperator?.statut || 'ACTIF',
      logoUrl: editingOperator?.logoUrl || '',
      actif: editingOperator?.actif ?? true
    }
  });

  React.useEffect(() => {
    if (editingOperator) {
      reset({
        nom: editingOperator.nom,
        pays: editingOperator.pays,
        codeDetection: editingOperator.codeDetection,
        statut: editingOperator.statut,
        logoUrl: editingOperator.logoUrl,
        actif: editingOperator.actif
      });
    } else {
      reset({
        nom: '',
        pays: '',
        codeDetection: '',
        statut: 'ACTIF',
        logoUrl: '',
        actif: true
      });
    }
  }, [editingOperator, reset]);

  const handleFormSubmit = async (data: CreateOperatorDto) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingOperator ? 'Modifier l\'opérateur' : 'Nouvel opérateur'}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <Controller
              name="nom"
              control={control}
              rules={{ required: 'Le nom est requis' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Nom"
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="pays"
              control={control}
              rules={{ required: 'Le pays est requis' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Pays"
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="codeDetection"
              control={control}
              rules={{ required: 'Le code de détection est requis' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Code de détection"
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="statut"
              control={control}
              rules={{ required: 'Le statut est requis' }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <InputLabel>Statut</InputLabel>
                  <Select {...field} label="Statut">
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              name="logoUrl"
              control={control}
              rules={{ required: 'L\'URL du logo est requise' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="URL du logo"
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained" color="primary">
            {editingOperator ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default OperatorForm; 