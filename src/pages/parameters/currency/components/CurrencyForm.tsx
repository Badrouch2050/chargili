import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Grid
} from '@mui/material';
import { useForm, Controller, FieldValues, Control } from 'react-hook-form';
import { Currency, CreateCurrencyDto } from '../types';
import { createCurrency, updateCurrency } from '../services/currencyService';

interface CurrencyFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingCurrency: Currency | null;
}

const CurrencyForm: React.FC<CurrencyFormProps> = ({
  open,
  onClose,
  onSuccess,
  editingCurrency
}) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<CreateCurrencyDto>({
    defaultValues: {
      code: '',
      name: '',
      symbol: '',
      active: true,
      region: '',
      priority: 1
    }
  });

  React.useEffect(() => {
    if (editingCurrency) {
      reset({
        code: editingCurrency.code,
        name: editingCurrency.name,
        symbol: editingCurrency.symbol,
        active: editingCurrency.active,
        region: editingCurrency.region,
        priority: editingCurrency.priority
      });
    } else {
      reset({
        code: '',
        name: '',
        symbol: '',
        active: true,
        region: '',
        priority: 1
      });
    }
  }, [editingCurrency, reset]);

  const onSubmit = async (data: CreateCurrencyDto) => {
    try {
      if (editingCurrency) {
        await updateCurrency(editingCurrency.id, data);
      } else {
        await createCurrency(data);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingCurrency ? 'Modifier la devise' : 'Ajouter une devise'}
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Controller
                name="code"
                control={control}
                rules={{
                  required: 'Le code est requis',
                  pattern: {
                    value: /^[A-Z]{3}$/,
                    message: 'Le code doit être composé de 3 lettres majuscules'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Code"
                    fullWidth
                    error={!!errors.code}
                    helperText={errors.code?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="name"
                control={control}
                rules={{ required: 'Le nom est requis' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nom"
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="symbol"
                control={control}
                rules={{ required: 'Le symbole est requis' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Symbole"
                    fullWidth
                    error={!!errors.symbol}
                    helperText={errors.symbol?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="region"
                control={control}
                rules={{ required: 'La région est requise' }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Région"
                    fullWidth
                    error={!!errors.region}
                    helperText={errors.region?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="priority"
                control={control}
                rules={{
                  required: 'La priorité est requise',
                  min: {
                    value: 1,
                    message: 'La priorité doit être un nombre positif'
                  }
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Priorité"
                    type="number"
                    fullWidth
                    error={!!errors.priority}
                    helperText={errors.priority?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                    }
                    label="Actif"
                  />
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained" color="primary">
            {editingCurrency ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default CurrencyForm; 