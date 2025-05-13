import { api } from '../../../../common/services/api';
import { MainCurrency, CreateMainCurrencyDto, UpdateMainCurrencyDto } from '../types';
import axios from 'axios';

class MainCurrencyServiceError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'MainCurrencyServiceError';
  }
}

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Une erreur est survenue';
    throw new MainCurrencyServiceError(message, status);
  }
  throw new MainCurrencyServiceError('Une erreur inattendue est survenue');
};

export const getMainCurrencies = async (): Promise<MainCurrency[]> => {
  try {
    const response = await api.get('/api/backoffice/main-currencies');
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getMainCurrency = async (id: number): Promise<MainCurrency> => {
  try {
    const response = await api.get(`/api/backoffice/main-currencies/${id}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createMainCurrency = async (data: CreateMainCurrencyDto): Promise<MainCurrency> => {
  try {
    const response = await api.post('/api/backoffice/main-currencies', data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateMainCurrency = async (id: number, data: UpdateMainCurrencyDto): Promise<MainCurrency> => {
  try {
    const response = await api.put(`/api/backoffice/main-currencies/${id}`, data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const toggleMainCurrency = async (id: number): Promise<MainCurrency> => {
  try {
    const response = await api.patch(`/api/backoffice/main-currencies/${id}/toggle`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}; 