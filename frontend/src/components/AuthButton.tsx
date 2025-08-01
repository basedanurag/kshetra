import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

/**
 * AuthButton Component
 * 
 * A complete authentication component that demonstrates:
 * - Login/logout functionality
 * - Loading states
 * - Error handling
 * - User feedback
 * - Principal display
 */
const AuthButton: React.FC = () => {
  const { 
    isAuthenticated, 
    loading, 
    principal, 
    roles, 
    error, 
    login, 
    logout 
  } = useAuth();
  
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleLogin = async () => {
    setActionLoading(true);
    setActionError(null);
    
    const result = await login();
    
    if (!result.success) {
      setActionError(result.error || 'Login failed');
    }
    
    setActionLoading(false);
  };

  const handleLogout = async () => {
    setActionLoading(true);
    setActionError(null);
    
    const result = await logout();
    
    if (!result.success) {
      setActionError(result.error || 'Logout failed');
    }
    
    setActionLoading(false);
  };

  // Show loading spinner during initial authentication check
  if (loading) {
    return (
      <div className="auth-button-container">
        <div className="loading-spinner">
          <span>🔄 Checking authentication...</span>
        </div>
      </div>
    );
  }

  // Show error if authentication check failed
  if (error) {
    return (
      <div className="auth-button-container">
        <div className="error-message">
          <span>❌ Authentication Error: {error}</span>
          <button 
            onClick={() => window.location.reload()} 
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // User is authenticated - show user info and logout button
  if (isAuthenticated && principal) {
    return (
      <div className="auth-button-container authenticated">
        <div className="user-info">
          <div className="welcome-message">
            <span>👋 Welcome!</span>
          </div>
          <div className="principal-info">
            <strong>Principal:</strong> {principal.toString().substring(0, 12)}...
          </div>
          {roles.length > 0 && (
            <div className="roles-info">
              <strong>Roles:</strong> {roles.join(', ')}
            </div>
          )}
          {actionError && (
            <div className="action-error">
              ❌ {actionError}
            </div>
          )}
        </div>
        
        <button
          onClick={handleLogout}
          disabled={actionLoading}
          className="logout-button"
        >
          {actionLoading ? '🔄 Logging out...' : '🚪 Logout'}
        </button>
      </div>
    );
  }

  // User is not authenticated - show login button
  return (
    <div className="auth-button-container unauthenticated">
      <div className="login-prompt">
        <p>Sign in to access your account</p>
        {actionError && (
          <div className="action-error">
            ❌ {actionError}
          </div>
        )}
      </div>
      
      <button
        onClick={handleLogin}
        disabled={actionLoading}
        className="login-button"
      >
        {actionLoading ? '🔄 Connecting...' : '🔐 Login with Internet Identity'}
      </button>
      
      <div className="login-help">
        <small>
          Secure authentication powered by Internet Identity
        </small>
      </div>
    </div>
  );
};

export default AuthButton;
