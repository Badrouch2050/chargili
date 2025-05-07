// Types pour la pagination
export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    sorted: boolean;
  };
}

// Types pour la liste des clients
export interface ClientListItem {
  id: number;
  nom: string;
  email: string;
  statut: string;
  dateInscription: string;
  actif: boolean;
}

export interface ClientListResponse {
  content: ClientListItem[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

// Types pour les contacts fréquents
export interface ContactFrequent {
  numero: string;
  nom: string;
}

// Types pour les transactions
export interface Transaction {
  id: number;
  operateur: string;
  numeroCible: string;
  montant: number;
  devisePaiement: string;
  statut: string;
  dateDemande: string;
  dateTraitement: string;
  montantCarte: number;
  deviseCarte: string;
  tauxDeChange: number;
  fraisConversion: number;
  pays: string;
  commission: number;
  typeCommission: string;
}

// Types pour les litiges
export interface Litige {
  id: number;
  transactionId: number;
  motif: string;
  statut: string;
  commentaire: string;
  dateCreation: string;
  dateResolution: string | null;
}

// Types pour les informations de parrainage
export interface ReferralInfo {
  codeParrainage: string;
  parrainEmail: string;
  montantTotalParrainage: number;
  nombreRecharges: number;
  bonusTotal: number;
  statut: string;
}

// Types pour les détails complets d'un client
export interface ClientDetails {
  id: number;
  nom: string;
  email: string;
  role: string;
  statut: string;
  methodeAuthentification: string;
  dateInscription: string;
  actif: boolean;
  
  montantTotalRecharge: number;
  nombreRecharges: number;
  montantMoyenRecharge: number;
  operateurPrefere: string;
  devisePaiement: string;
  paysPrefere: string;
  
  contactsFrequents: ContactFrequent[];
  dernieresTransactions: Transaction[];
  referralInfo?: ReferralInfo;
  litigesEnCours: Litige[];
}

// Types pour les paramètres de recherche
export interface ClientSearchParams {
  nom?: string;
  email?: string;
  statut?: string;
  dateDebut?: string;
  dateFin?: string;
  page?: number;
  size?: number;
  sort?: string;
}

// Types pour les erreurs
export interface ApiError {
  message: string;
  status: number;
} 