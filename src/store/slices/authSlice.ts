import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getToken } from '../../services/auth/tokenService';

interface User {
  email: string;
  role: 'ADMIN' | 'AGENT' | 'USER';
  nom?: string;
  statut?: 'ACTIF' | 'INACTIF';
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Vérifier si un token existe au démarrage
const token = getToken();
const initialState: AuthState = {
  isAuthenticated: !!token,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
    },
    restoreAuth: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout, restoreAuth } = authSlice.actions;
export default authSlice.reducer; 