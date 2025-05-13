export type TicketStatus = 'OUVERT' | 'EN_COURS' | 'RESOLU' | 'FERME';

export interface User {
  id: number;
  nom: string;
  email: string;
}

export interface SupportTicket {
  id: number;
  user: User;
  sujet: string;
  message: string;
  statut: TicketStatus;
  reponse: string | null;
  dateCreation: string;
  dateResolution: string | null;
}

export interface CreateTicketDto {
  userId: number;
  sujet: string;
  message: string;
}

export interface RespondTicketDto {
  reponse: string;
  statut: TicketStatus;
}

export interface TicketFilter {
  statut?: TicketStatus;
  userId?: number;
  dateCreationStart?: string;
  dateCreationEnd?: string;
  dateResolutionStart?: string;
  dateResolutionEnd?: string;
  search?: string;
} 