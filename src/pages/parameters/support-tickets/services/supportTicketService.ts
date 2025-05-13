import { api } from '../../../../common/services/api';
import { SupportTicket, CreateTicketDto, RespondTicketDto, TicketFilter } from '../types';
import axios from 'axios';

class SupportTicketServiceError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'SupportTicketServiceError';
  }
}

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message || 'Une erreur est survenue';
    throw new SupportTicketServiceError(message, status);
  }
  throw new SupportTicketServiceError('Une erreur inattendue est survenue');
};

export const getTickets = async (filters?: TicketFilter): Promise<SupportTicket[]> => {
  try {
    const response = await api.get('/api/backoffice/support-tickets', { params: filters });
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const getTicketsByUser = async (userId: number): Promise<SupportTicket[]> => {
  try {
    const response = await api.get(`/api/backoffice/support-tickets/user/${userId}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const createTicket = async (data: CreateTicketDto): Promise<SupportTicket> => {
  try {
    const response = await api.post('/api/backoffice/support-tickets', data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};

export const respondToTicket = async (id: number, data: RespondTicketDto): Promise<SupportTicket> => {
  try {
    const response = await api.patch(`/api/backoffice/support-tickets/${id}/respond`, data);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
}; 