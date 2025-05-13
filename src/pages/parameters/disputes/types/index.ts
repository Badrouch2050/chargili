export type DisputeStatus = 'OUVERT' | 'EN_COURS' | 'RESOLU' | 'REMBOURSE' | 'REJETE';

export interface Transaction {
  id: number;
  montant: number;
  devisePaiement: string;
  statut: string;
}

export interface User {
  id: number;
  nom: string;
  email: string;
}

export interface Dispute {
  id: number;
  transaction: Transaction;
  user: User;
  motif: string;
  statut: DisputeStatus;
  commentaire: string;
  dateCreation: string;
  dateResolution: string | null;
}

export interface CreateDisputeDto {
  transactionId: number;
  motif: string;
  commentaire?: string;
}

export interface UpdateDisputeStatusDto {
  statut: DisputeStatus;
  commentaire?: string;
}

export interface DisputeFilter {
  statut?: DisputeStatus;
  transactionId?: number;
  userId?: number;
  dateCreationStart?: string;
  dateCreationEnd?: string;
  dateResolutionStart?: string;
  dateResolutionEnd?: string;
  search?: string;
} 