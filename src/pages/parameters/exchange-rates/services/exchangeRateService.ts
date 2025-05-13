import axios from 'axios';
import { getToken } from '../../../../services/auth/tokenService';

export interface ExchangeRate {
  id: number;
  deviseSource: string;
  deviseCible: string;
  taux: number;
  dateObtention: string;
  actif: boolean;
}

export interface ExchangeRateHistory {
  id: number;
  taux: number;
  dateModification: string;
  modifiedBy: string;
}

export interface ConversionResult {
  montantSource: number;
  deviseSource: string;
  montantCible: number;
  deviseCible: string;
  taux: number;
  dateCalcul: string;
}

const API_URL = 'http://localhost:8080/api/backoffice';

// 1. Liste des taux de change
export const getExchangeRates = async (): Promise<ExchangeRate[]> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token non trouvé');
  }
  const response = await axios.get(`${API_URL}/taux-de-change`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// 2. Détails d'un taux de change
export const getExchangeRate = async (id: number): Promise<ExchangeRate> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token non trouvé');
  }
  const response = await axios.get(`${API_URL}/taux-de-change/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// 3. Création d'un taux de change
export const createExchangeRate = async (data: Omit<ExchangeRate, 'id' | 'dateObtention' | 'actif'>): Promise<ExchangeRate> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token non trouvé');
  }
  const response = await axios.post(`${API_URL}/taux-de-change`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// 4. Mise à jour d'un taux de change
export const updateExchangeRate = async (id: number, data: Partial<ExchangeRate>): Promise<ExchangeRate> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token non trouvé');
  }
  const response = await axios.put(`${API_URL}/taux-de-change/${id}`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// 5. Activation/Désactivation d'un taux de change
export const toggleExchangeRate = async (id: number): Promise<ExchangeRate> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token non trouvé');
  }
  const response = await axios.patch(`${API_URL}/taux-de-change/${id}/toggle`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// 6. Historique des modifications
export const getExchangeRateHistory = async (id: number): Promise<ExchangeRateHistory[]> => {
  const token = getToken();
  if (!token) {
    throw new Error('Token non trouvé');
  }
  const response = await axios.get(`${API_URL}/taux-de-change/${id}/historique`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return response.data;
};

// 7. Calcul de conversion
export const calculateConversion = async (params: {
  montant: number;
  deviseSource: string;
  deviseCible: string;
}): Promise<number> => {
  const token = getToken();
  try {
    const response = await axios.get(`${API_URL}/taux-de-change/calcul`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      params: {
        montant: params.montant,
        deviseSource: params.deviseSource,
        deviseCible: params.deviseCible
      }
    });
    return response.data.montantCible;
  } catch (error) {
    throw new Error('Erreur lors de la conversion');
  }
}; 