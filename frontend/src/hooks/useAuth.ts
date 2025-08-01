import { useState, useEffect, useCallback } from 'react';
import authService, { AuthStatus } from '../services/AuthService';

interface UseAuthState extends AuthStatus {
  loading: boolean;
  error?: string;
}

interface UseAuthReturn extends UseAuthState {
  authClient: any;
  userProfile: any;
  login: () => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  refresh: () => Promise<void>;
}

/**
 * Custom React hook for managing authentication state
 * 
 * This hook provides:
 * - Current authentication status
 * - Login and logout functions
 * - Loading states
 * - Error handling
 * - Automatic authentication check on mount
 */
export const useAuth = (): UseAuthReturn => {
  const [authState, setAuthState] = useState<UseAuthState>({
    isAuthenticated: false,
    loading: true,
    principal: undefined,
    roles: [],
    error: undefined
  });

  // Check authentication status
  const checkAuthentication = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: undefined }));
      
      // Initialize the service first
      await authService.init();
      
      // Check current authentication status
      const status = await authService.checkAuth();
      
      setAuthState({
        ...status,
        loading: false,
        error: undefined
      });
    } catch (error) {
      console.error('Authentication check failed:', error);
      setAuthState({
        isAuthenticated: false,
        loading: false,
        principal: undefined,
        roles: [],
        error: error instanceof Error ? error.message : 'Authentication check failed'
      });
    }
  }, []);

  // Login function
  const login = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: undefined }));
      
      // Attempt login
      await authService.login();
      
      // Check authentication status after login
      const status = await authService.checkAuth();
      
      setAuthState({
        ...status,
        loading: false,
        error: undefined
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      console.error('Login failed:', error);
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  }, []);

  // Logout function
  const logout = useCallback(async (): Promise<{ success: boolean; error?: string }> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: undefined }));
      
      // Attempt logout
      await authService.logout();
      
      // Update state to reflect logout
      setAuthState({
        isAuthenticated: false,
        loading: false,
        principal: undefined,
        roles: [],
        error: undefined
      });
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      console.error('Logout failed:', error);
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      
      return { 
        success: false, 
        error: errorMessage
      };
    }
  }, []);

  // Refresh authentication status
  const refresh = useCallback(async () => {
    await checkAuthentication();
  }, [checkAuthentication]);

  // Check authentication on mount
  useEffect(() => {
    checkAuthentication();
  }, [checkAuthentication]);

  return {
    ...authState,
    authClient: null, // TODO: Get from authService
    userProfile: null, // TODO: Implement user profile logic
    login,
    logout,
    refresh
  };
};
