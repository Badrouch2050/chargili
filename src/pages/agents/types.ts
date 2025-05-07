export interface Agent {
  id: number;
  nom: string;
  email: string;
  role: 'AGENT';
  actif: boolean;
}

export interface CreateAgentRequest {
  nom: string;
  email: string;
  motDePasse: string;
  role: 'AGENT';
}

export interface UpdateAgentRequest {
  nom?: string;
  email?: string;
  motDePasse?: string;
  role?: 'AGENT';
  actif?: boolean;
}

export interface AgentResponse {
  id: number;
  nom: string;
  email: string;
  role: 'AGENT';
  actif: boolean;
}

export interface ApiError {
  message: string;
  status: number;
} 