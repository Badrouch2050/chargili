import api from '../api/config';
import { getToken, setToken, removeToken } from './tokenService';

interface LoginCredentials {
  email: string;
  motDePasse: string;
}

interface ChangePasswordCredentials {
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
  confirmationMotDePasse: string;
}

interface User {
  email: string;
  role: 'ADMIN' | 'AGENT' | 'USER';
  nom?: string;
  statut?: 'ACTIF' | 'INACTIF';
}

interface LoginResponse {
  token: string;
  email: string;
  role: 'ADMIN' | 'AGENT' | 'USER';
  nom?: string;
  statut?: 'ACTIF' | 'INACTIF';
}

interface ApiError {
  response?: {
    status: number;
    data?: {
      message?: string;
    };
  };
  message?: string;
}

export const login = async (credentials: LoginCredentials): Promise<{ token: string; user: User }> => {
  try {
    const response = await api.post<LoginResponse>('/api/front/auth/login', {
      email: credentials.email,
      motDePasse: credentials.motDePasse
    });
    
    const { token, email, role, nom, statut } = response.data;
    
    if (!token || !email || !role) {
      throw new Error('Réponse invalide du serveur');
    }

    if (statut && statut !== 'ACTIF') {
      throw new Error('Votre compte est inactif. Veuillez contacter l\'administrateur.');
    }

    // Vérification que l'utilisateur a un rôle autorisé
    if (!['ADMIN', 'AGENT'].includes(role)) {
      throw new Error('Accès réservé aux administrateurs et aux agents');
    }
    
    const user: User = {
      email,
      role,
      nom,
      statut
    };
    
    setToken(token);
    return { token, user };
  } catch (error) {
    const apiError = error as ApiError;
    console.error('Login error:', apiError);
    
    if (apiError.response) {
      switch (apiError.response.status) {
        case 400:
          throw new Error('Email ou mot de passe incorrect');
        case 401:
          throw new Error('Identifiants invalides');
        case 403:
          throw new Error('Accès non autorisé');
        case 500:
          throw new Error('Erreur serveur. Veuillez réessayer plus tard');
        default:
          throw new Error(apiError.response.data?.message || 'Une erreur est survenue');
      }
    } else if (apiError.message) {
      throw new Error(apiError.message);
    } else {
      throw new Error('Impossible de se connecter au serveur');
    }
  }
};

export const changePassword = async (credentials: ChangePasswordCredentials): Promise<void> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Non authentifié');
    }

    // Validation des mots de passe
    if (credentials.nouveauMotDePasse !== credentials.confirmationMotDePasse) {
      throw new Error('Les nouveaux mots de passe ne correspondent pas');
    }

    if (credentials.nouveauMotDePasse.length < 8) {
      throw new Error('Le nouveau mot de passe doit contenir au moins 8 caractères');
    }

    // Vérification de la complexité du mot de passe
    const hasUpperCase = /[A-Z]/.test(credentials.nouveauMotDePasse);
    const hasLowerCase = /[a-z]/.test(credentials.nouveauMotDePasse);
    const hasNumbers = /\d/.test(credentials.nouveauMotDePasse);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(credentials.nouveauMotDePasse);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
      throw new Error('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial');
    }

    await api.post('/api/front/auth/change-password', {
      ancienMotDePasse: credentials.ancienMotDePasse,
      nouveauMotDePasse: credentials.nouveauMotDePasse
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // Déconnexion après changement de mot de passe
    await logout();
  } catch (error) {
    const apiError = error as ApiError;
    console.error('Erreur de changement de mot de passe:', apiError);
    
    if (apiError.response) {
      switch (apiError.response.status) {
        case 400:
          throw new Error(apiError.response.data?.message || 'Ancien mot de passe incorrect');
        case 401:
          throw new Error('Session expirée. Veuillez vous reconnecter');
        case 403:
          throw new Error('Accès non autorisé');
        case 500:
          throw new Error('Erreur serveur. Veuillez réessayer plus tard');
        default:
          throw new Error(apiError.response.data?.message || 'Une erreur est survenue');
      }
    } else if (apiError.message) {
      throw new Error(apiError.message);
    } else {
      throw new Error('Impossible de se connecter au serveur');
    }
  }
};

export const logout = async (): Promise<void> => {
  try {
    const token = getToken();
    if (token) {
      // Appel à l'API de déconnexion
      await api.post('/api/front/auth/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error);
    // On continue quand même à supprimer le token local en cas d'erreur
  } finally {
    // Suppression du token local dans tous les cas
    removeToken();
  }
};

export const refreshToken = async (): Promise<string> => {
  try {
    const response = await api.post<{ token: string }>('/api/front/auth/refresh-token');
    const { token } = response.data;
    
    if (!token) {
      throw new Error('Token de rafraîchissement invalide');
    }
    
    setToken(token);
    return token;
  } catch (error) {
    const apiError = error as ApiError;
    console.error('Erreur de rafraîchissement du token:', apiError);
    throw new Error(apiError.response?.data?.message || 'Erreur lors du rafraîchissement du token');
  }
}; 