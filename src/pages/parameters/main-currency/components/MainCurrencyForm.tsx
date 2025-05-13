import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { MainCurrency, CreateMainCurrencyDto, UpdateMainCurrencyDto } from '../types';

interface MainCurrencyFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMainCurrencyDto | UpdateMainCurrencyDto) => Promise<void>;
  editingCurrency?: MainCurrency;
}

const MainCurrencyForm: React.FC<MainCurrencyFormProps> = ({
  open,
  onClose,
  onSubmit,
  editingCurrency
}) => {
  const { control, handleSubmit, reset } = useForm<CreateMainCurrencyDto>({
    defaultValues: {
      code: editingCurrency?.code || '',
      name: editingCurrency?.name || '',
      symbol: editingCurrency?.symbol || ''
    }
  });

  React.useEffect(() => {
    if (editingCurrency) {
      reset({
        code: editingCurrency.code,
        name: editingCurrency.name,
        symbol: editingCurrency.symbol
      });
    } else {
      reset({
        code: '',
        name: '',
        symbol: ''
      });
    }
  }, [editingCurrency, reset]);

  const handleFormSubmit = async (data: CreateMainCurrencyDto) => {
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
        {editingCurrency ? 'Modifier la devise principale' : 'Nouvelle devise principale'}
      </DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2}>
            <Controller
              name="code"
              control={control}
              rules={{ required: 'Le code est requis' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Code"
                  error={!!error}
                  helperText={error?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              name="name"
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
              name="symbol"
              control={control}
              rules={{ required: 'Le symbole est requis' }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Symbole"
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
            {editingCurrency ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default MainCurrencyForm; 