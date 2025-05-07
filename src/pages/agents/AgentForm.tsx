import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Alert
} from '@mui/material';
import { Agent, CreateAgentRequest, UpdateAgentRequest, ApiError } from './types';
import { agentService } from './services/agentService';

interface AgentFormProps {
  agent: Agent | null;
  onClose: () => void;
  onSubmit: () => void;
}

const AgentForm: React.FC<AgentFormProps> = ({ agent, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CreateAgentRequest | UpdateAgentRequest>({
    nom: '',
    email: '',
    motDePasse: '',
    role: 'AGENT'
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (agent) {
      setFormData({
        nom: agent.nom,
        email: agent.email,
        role: 'AGENT',
        actif: agent.actif
      });
    }
  }, [agent]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'actif' ? checked : value
    }));
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!formData.nom) errors.push('Le nom est requis');
    if (!formData.email) errors.push('L\'email est requis');
    if (!agent && !formData.motDePasse) errors.push('Le mot de passe est requis');
    if (formData.motDePasse && formData.motDePasse.length < 8) {
      errors.push('Le mot de passe doit contenir au moins 8 caractères');
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Format d\'email invalide');
    }

    if (errors.length > 0) {
      setError(errors.join(', '));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (agent) {
        await agentService.updateAgent(agent.id, formData as UpdateAgentRequest);
      } else {
        await agentService.createAgent(formData as CreateAgentRequest);
      }
      onSubmit();
    } catch (err) {
      const error = err as ApiError;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {agent ? 'Modifier l\'agent' : 'Créer un nouvel agent'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            label="Nom"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Mot de passe"
            name="motDePasse"
            type="password"
            value={formData.motDePasse || ''}
            onChange={handleChange}
            helperText={agent ? 'Laisser vide pour ne pas modifier' : 'Minimum 8 caractères'}
          />
          {agent && (
            <FormControlLabel
              control={
                <Switch
                  name="actif"
                  checked={(formData as UpdateAgentRequest).actif || false}
                  onChange={handleChange}
                />
              }
              label="Actif"
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Annuler</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? 'En cours...' : agent ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AgentForm; 