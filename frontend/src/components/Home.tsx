import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthService from '../services/AuthService';
import './Home.css';

const Home: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const authStatus = await AuthService.checkAuth();
      setIsAuthenticated(authStatus.isAuthenticated);
      setUserRole(authStatus.roles);
    } catch (error) {
      console.error('Authentication check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      await AuthService.login();
      await checkAuthentication();
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      setIsAuthenticated(false);
      setUserRole([]);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Kshetra Land Registry</h1>
        <p className="subtitle">Decentralized Land Management on Internet Computer</p>
      </header>

      <main className="home-main">
        {!isAuthenticated ? (
          <div className="auth-section">
            <h2>Welcome to Kshetra</h2>
            <p>
              Secure, transparent, and immutable land registry powered by blockchain technology.
              Connect with Internet Identity to get started.
            </p>
            <button className="login-button" onClick={handleLogin}>
              Connect with Internet Identity
            </button>
          </div>
        ) : (
          <div className="dashboard-section">
            <h2>Welcome back!</h2>
            <p>Choose your dashboard based on your role:</p>
            
            <div className="dashboard-cards">
              {userRole.includes('Admin') || userRole.includes('LandRegistrar') ? (
                <Link to="/admin" className="dashboard-card admin-card">
                  <h3>Admin Dashboard</h3>
                  <p>Manage land parcels, approve registrations, and oversee the system</p>
                </Link>
              ) : null}
              
              <Link to="/user" className="dashboard-card user-card">
                <h3>User Dashboard</h3>
                <p>View your land parcels, transfer ownership, and manage documents</p>
              </Link>
            </div>

            <div className="user-info">
              <p><strong>Your Roles:</strong> {userRole.join(', ')}</p>
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        )}

        <div className="features-section">
          <h3>Key Features</h3>
          <div className="features-grid">
            <div className="feature-card">
              <h4>🔒 Secure Ownership</h4>
              <p>Cryptographically secured land ownership records</p>
            </div>
            <div className="feature-card">
              <h4>📋 Document Management</h4>
              <p>Store and verify land documents on IPFS and ICP</p>
            </div>
            <div className="feature-card">
              <h4>🗺️ Interactive Maps</h4>
              <p>Visualize land parcels with geographic coordinates</p>
            </div>
            <div className="feature-card">
              <h4>📈 Transaction History</h4>
              <p>Complete audit trail of all land transactions</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
