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
  Select,
  FormControlLabel,
  Switch
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { Commission, CreateCommissionDto, UpdateCommissionDto, CommissionType } from '../types';

interface CommissionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCommissionDto | UpdateCommissionDto) => Promise<void>;
  editingCommission?: Commission;
  operators: string[];
}

const typeOptions: CommissionType[] = ['POURCENTAGE', 'FIXE'];

const CommissionForm: React.FC<CommissionFormProps> = ({
  open,
  onClose,
  onSubmit,
  editingCommission,
  operators
}) => {
  const { control, handleSubmit, reset, watch } = useForm<CreateCommissionDto>({
    defaultValues: {
      pays: editingCommission?.pays || '',
      operateur: editingCommission?.operateur || '',
      typeCommission: editingCommission?.typeCommission || 'POURCENTAGE',
      valeur: editingCommission?.valeur || 0,
      actif: editingCommission?.actif ?? true
    }
  });

  const typeCommission = watch('typeCommission');

  React.useEffect(() => {
    if (editingCommission) {
      reset({
        pays: editingCommission.pays,
        operateur: editingCommission.operateur || '',
        typeCommission: editingCommission.typeCommission,
        valeur: editingCommission.valeur,
        actif: editingCommission.actif
      });
    } else {
      reset({
        pays: '',
        operateur: '',
        typeCommission: 'POURCENTAGE',
        valeur: 0,
        actif: true
      });
    }
  }, [editingCommission, reset]);

  const handleFormSubmit = async (data: CreateCommissionDto) => {
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
        {editingCommission ? 'Modifier la commission' : 'Nouvelle commission'}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
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
              name="operateur"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Opérateur</InputLabel>
                  <Select {...field} label="Opérateur">
                    <MenuItem value="">Global (pour tout le pays)</MenuItem>
                    {operators.map((operator) => (
                      <MenuItem key={operator} value={operator}>
                        {operator}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              name="typeCommission"
              control={control}
              rules={{ required: 'Le type de commission est requis' }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <InputLabel>Type de commission</InputLabel>
                  <Select {...field} label="Type de commission">
                    {typeOptions.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
            <Controller
              name="valeur"
              control={control}
              rules={{
                required: 'La valeur est requise',
                min: {
                  value: 0,
                  message: 'La valeur doit être positive'
                },
                max: typeCommission === 'POURCENTAGE' ? {
                  value: 100,
                  message: 'Le pourcentage ne peut pas dépasser 100%'
                } : undefined
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  type="number"
                  label={`Valeur ${typeCommission === 'POURCENTAGE' ? '(%)' : '(€)'}`}
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                  inputProps={{
                    step: typeCommission === 'POURCENTAGE' ? 0.1 : 1,
                    min: 0,
                    max: typeCommission === 'POURCENTAGE' ? 100 : undefined
                  }}
                />
              )}
            />
            <Controller
              name="actif"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControlLabel
                  control={
                    <Switch
                      checked={value}
                      onChange={(e) => onChange(e.target.checked)}
                    />
                  }
                  label="Actif"
                />
              )}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained" color="primary">
            {editingCommission ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CommissionForm; 