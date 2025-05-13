import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Grid
} from '@mui/material';

interface StockCardFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: StockCardFormData) => void;
  initialData?: StockCardFormData;
  isEdit?: boolean;
}

export interface StockCardFormData {
  operateur: string;
  montant: number;
  code: string;
  pays: string;
}

const operateurs = ['Orange', 'Free', 'SFR', 'Bouygues'];
const pays = ['France', 'Belgique', 'Suisse', 'Luxembourg'];

const StockCardForm: React.FC<StockCardFormProps> = ({ 
  open, 
  onClose, 
  onSubmit, 
  initialData,
  isEdit = false 
}) => {
  const [formData, setFormData] = useState<StockCardFormData>({
    operateur: '',
    montant: 0,
    code: '',
    pays: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        operateur: '',
        montant: 0,
        code: '',
        pays: ''
      });
    }
  }, [initialData, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'montant' ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {isEdit ? 'Modifier la carte' : 'Ajouter une nouvelle carte'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Opérateur"
                name="operateur"
                value={formData.operateur}
                onChange={handleChange}
                required
              >
                {operateurs.map((operateur) => (
                  <MenuItem key={operateur} value={operateur}>
                    {operateur}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Montant"
                name="montant"
                type="number"
                value={formData.montant}
                onChange={handleChange}
                required
                InputProps={{
                  endAdornment: '€'
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                required
                disabled={isEdit}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                fullWidth
                label="Pays"
                name="pays"
                value={formData.pays}
                onChange={handleChange}
                required
              >
                {pays.map((pays) => (
                  <MenuItem key={pays} value={pays}>
                    {pays}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button type="submit" variant="contained" color="primary">
            {isEdit ? 'Modifier' : 'Ajouter'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default StockCardForm; 