import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../services/AuthService';
import './Auth.css';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requireAuthenticated?: boolean;
  fallbackPath?: string;
}

/**
 * ProtectedRoute Component
 * 
 * Handles route protection based on authentication status and user roles.
 * Provides seamless redirection and user feedback for unauthorized access.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  requireAuthenticated = true,
  fallbackPath = '/'
}) => {
  const { isAuthenticated, roles, loading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="protected-route-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Check if authentication is required
  if (requireAuthenticated && !isAuthenticated) {
    return (
      <Navigate 
        to={fallbackPath} 
        state={{ from: location, reason: 'authentication_required' }} 
        replace 
      />
    );
  }

  // Check if user has required roles
  if (requiredRoles.length > 0 && isAuthenticated) {
    const hasRequiredRole = requiredRoles.some(role => 
      roles.includes(role as any)
    );

    if (!hasRequiredRole) {
      return (
        <div className="access-denied">
          <div className="access-denied-content">
            <h2>🚫 Access Denied</h2>
            <p>You don't have the required permissions to access this page.</p>
            <p><strong>Required roles:</strong> {requiredRoles.join(', ')}</p>
            <p><strong>Your roles:</strong> {roles.join(', ') || 'None'}</p>
            <button 
              onClick={() => window.history.back()}
              className="back-button"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }
  }

  // Render the protected content
  return <>{children}</>;
};

export default ProtectedRoute;
