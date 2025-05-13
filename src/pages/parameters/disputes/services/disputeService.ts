import { api } from '../../../../common/services/api';
import { Dispute, CreateDisputeDto, UpdateDisputeStatusDto, DisputeFilter } from '../types';
import axios from 'axios';

class DisputeServiceError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'DisputeServiceError';
  }
}

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Une erreur est survenue';
    throw new DisputeServiceError(message, status);
  }
  throw new DisputeServiceError('Une erreur inattendue est survenue');
};

export const getDisputes = async (filters?: DisputeFilter): Promise<Dispute[]> => {
  try {
    const response = await api.get('/api/backoffice/disputes', { params: filters });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getDisputesByTransaction = async (transactionId: number): Promise<Dispute[]> => {
  try {
    const response = await api.get(`/api/backoffice/disputes/transaction/${transactionId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createDispute = async (data: CreateDisputeDto): Promise<Dispute> => {
  try {
    const response = await api.post('/api/backoffice/disputes', data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const updateDisputeStatus = async (id: number, data: UpdateDisputeStatusDto): Promise<Dispute> => {
  try {
    const response = await api.patch(`/api/backoffice/disputes/${id}/status`, data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}; 