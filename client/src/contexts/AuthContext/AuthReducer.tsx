import { AuthState, User, ApiError, AuthStatus } from '@/types';

// Define all possible actions that can modify the auth state
export type AuthAction =
  | { type: 'AUTH_START' }                              // When auth process begins
  | { type: 'AUTH_SUCCESS'; payload: User }             // When login/validation succeeds
  | { type: 'AUTH_FAILURE'; payload: ApiError }         // When auth fails with error
  | { type: 'LOGOUT' }                                  // When user logs out
  | { type: 'SET_LOADING'; payload: boolean }           // To control loading state
  | { type: 'SET_ERROR'; payload: ApiError | null }     // To set/clear errors
  | { type: 'SET_STATUS'; payload: AuthStatus }         // To update auth status
  | { type: 'VALIDATE_TOKEN_SUCCESS'; payload: User };  // When token validation succeeds

export const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      // Initialize authentication process
      return {
        ...state,
        isLoading: true,
        error: null,
        status: 'loading'
      };

    case 'AUTH_SUCCESS':
      // User successfully authenticated
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
        error: null,
        status: 'authenticated'
      };

    case 'AUTH_FAILURE':
      // Authentication failed
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: action.payload,
        status: 'unauthenticated'
      };

    case 'LOGOUT':
      // Clear all auth state
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
        status: 'unauthenticated'
      };

    case 'SET_LOADING':
      // Update loading state
      return {
        ...state,
        isLoading: action.payload,
        status: action.payload ? 'loading' : state.status
      };

    case 'SET_ERROR':
      // Update error state
      return {
        ...state,
        error: action.payload
      };

    case 'SET_STATUS':
      // Update auth status
      return {
        ...state,
        status: action.payload
      };

    case 'VALIDATE_TOKEN_SUCCESS':
      // Token validation successful
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        isLoading: false,
        error: null,
        status: 'authenticated'
      };

    default:
      return state;
  }
};