import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem
} from '@mui/material';
import { ExchangeRate, createExchangeRate, updateExchangeRate } from '../services/exchangeRateService';

interface ExchangeRateFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingRate: ExchangeRate | null;
}

const supportedCurrencies = [
  'EUR',
  'USD',
  'GBP',
  'AED',
  'SAR',
  'QAR',
  'KWD',
  'BHD',
  'OMR'
];

const ExchangeRateForm: React.FC<ExchangeRateFormProps> = ({
  open,
  onClose,
  onSuccess,
  editingRate
}) => {
  const [formData, setFormData] = useState({
    deviseSource: 'TND',
    deviseCible: '',
    taux: 0
  });

  useEffect(() => {
    if (editingRate) {
      setFormData({
        deviseSource: editingRate.deviseSource,
        deviseCible: editingRate.deviseCible,
        taux: editingRate.taux
      });
    } else {
      setFormData({
        deviseSource: 'TND',
        deviseCible: '',
        taux: 0
      });
    }
  }, [editingRate]);

  const handleSubmit = async () => {
    try {
      if (editingRate) {
        await updateExchangeRate(editingRate.id, formData);
      } else {
        await createExchangeRate(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingRate ? 'Modifier le taux de change' : 'Ajouter un taux de change'}
      </DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Devise Source"
          value={formData.deviseSource}
          disabled
          margin="normal"
        />
        <TextField
          select
          fullWidth
          label="Devise Cible"
          value={formData.deviseCible}
          onChange={(e) => setFormData({ ...formData, deviseCible: e.target.value })}
          margin="normal"
        >
          {supportedCurrencies.map((currency) => (
            <MenuItem key={currency} value={currency}>
              {currency}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          fullWidth
          label="Taux"
          type="number"
          value={formData.taux}
          onChange={(e) => setFormData({ ...formData, taux: Number(e.target.value) })}
          margin="normal"
          inputProps={{ step: 0.0001, min: 0 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {editingRate ? 'Modifier' : 'Ajouter'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExchangeRateForm; 