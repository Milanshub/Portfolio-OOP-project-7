import { createContext, useContext } from 'react';
import { 
  AuthState, 
  User,
  LoginRequest, 
  AuthResponse,
  AuthStatus,
  ApiError 
} from '@/types';

interface AuthContextType extends Omit<AuthState, 'error'> {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  validateToken: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  error: ApiError | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  status: 'idle'
};

export const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  logout: async () => {},
  validateToken: async () => {},
  requestPasswordReset: async () => {},
  resetPassword: async () => {},
  changePassword: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};