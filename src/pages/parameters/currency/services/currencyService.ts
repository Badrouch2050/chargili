import { Currency, CreateCurrencyDto, UpdateCurrencyDto } from '../types';
import { api } from '../../../../common/services/api';
import axios from 'axios';

class CurrencyServiceError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'CurrencyServiceError';
  }
}

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Une erreur est survenue';
    throw new CurrencyServiceError(message, status);
  }
  throw new CurrencyServiceError('Une erreur inattendue est survenue');
};

export const getCurrencies = async (): Promise<Currency[]> => {
  try {
    const response = await api.get('/api/backoffice/currencies');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getCurrency = async (id: number): Promise<Currency> => {
  try {
    const response = await api.get(`/api/backoffice/currencies/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createCurrency = async (currency: CreateCurrencyDto): Promise<Currency> => {
  try {
    const response = await api.post('/api/backoffice/currencies', currency);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateCurrency = async (id: number, currency: UpdateCurrencyDto): Promise<Currency> => {
  try {
    const response = await api.put(`/api/backoffice/currencies/${id}`, currency);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const toggleCurrency = async (id: number): Promise<Currency> => {
  try {
    const response = await api.patch(`/api/backoffice/currencies/${id}/toggle`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}; 