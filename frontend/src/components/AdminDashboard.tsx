import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLandRegistry } from '../hooks/useLandRegistry';
import { LandParcel } from '../services/LandRegistryService';
import ParcelList from './ParcelList';
import ParcelForm from './ParcelForm';
import TransferManagement from './TransferManagement';
import ParcelDetails from './ParcelDetails';
import SearchFilters from './SearchFilters';
import './AdminDashboard.css';

type ActiveTab = 'overview' | 'parcels' | 'transfers' | 'register';

const AdminDashboard: React.FC = () => {
  const { userProfile } = useAuth();
  const {
    parcels,
    transferRequests,
    pendingTransfers,
    selectedParcel,
    loading,
    parcelsLoading,
    transfersLoading,
    error,
    loadAllParcels,
    loadTransferRequests,
    selectParcel,
    clearError,
    refresh
  } = useLandRegistry();

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [searchFilters, setSearchFilters] = useState<Record<string, string>>({});
  const [filteredParcels, setFilteredParcels] = useState<LandParcel[]>([]);

  // Load data when component mounts
  useEffect(() => {
    if (userProfile?.role === 'Admin') {
      loadAllParcels();
      loadTransferRequests();
    }
  }, [userProfile, loadAllParcels, loadTransferRequests]);

  // Filter parcels based on search criteria
  useEffect(() => {
    let filtered = parcels;
    
    if (searchFilters.district) {
      filtered = filtered.filter(p => 
        p.district.toLowerCase().includes(searchFilters.district.toLowerCase())
      );
    }
    if (searchFilters.state) {
      filtered = filtered.filter(p => 
        p.state.toLowerCase().includes(searchFilters.state.toLowerCase())
      );
    }
    if (searchFilters.land_use) {
      filtered = filtered.filter(p => 
        p.land_use.toLowerCase().includes(searchFilters.land_use.toLowerCase())
      );
    }
    if (searchFilters.owner) {
      filtered = filtered.filter(p => 
        p.owner.toString().includes(searchFilters.owner)
      );
    }
    
    setFilteredParcels(filtered);
  }, [parcels, searchFilters]);

  // Calculate statistics
  const totalParcels = parcels.length;
  const totalPendingTransfers = pendingTransfers.length;
  const totalArea = parcels.reduce((sum, parcel) => sum + parcel.area, 0);
  const averageArea = totalParcels > 0 ? totalArea / totalParcels : 0;

  const handleRefresh = async () => {
    await refresh();
  };

  const handleParcelSelect = (parcel: LandParcel) => {
    selectParcel(parcel);
    setActiveTab('parcels');
  };

  const handleTransferSuccess = () => {
    loadTransferRequests();
    loadAllParcels();
  };

  const handleParcelRegistered = () => {
    loadAllParcels();
    setActiveTab('parcels');
  };

  if (userProfile?.role !== 'Admin') {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You need admin privileges to access this dashboard.</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Admin Dashboard</h1>
          <p>Manage land parcels and user accounts</p>
        </div>
        <div className="header-actions">
          <button 
            onClick={handleRefresh} 
            className="refresh-button"
            disabled={loading}
          >
            {loading ? 'Refreshing...' : '🔄 Refresh'}
          </button>
          {error && (
            <div className="error-banner">
              <span>{error}</span>
              <button onClick={clearError}>×</button>
            </div>
          )}
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="dashboard-nav">
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`nav-tab ${activeTab === 'parcels' ? 'active' : ''}`}
          onClick={() => setActiveTab('parcels')}
        >
          Parcels ({totalParcels})
        </button>
        <button 
          className={`nav-tab ${activeTab === 'transfers' ? 'active' : ''}`}
          onClick={() => setActiveTab('transfers')}
        >
          Transfers ({totalPendingTransfers})
        </button>
        <button 
          className={`nav-tab ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
        >
          Register Parcel
        </button>
      </nav>
      
      <div className="dashboard-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🏞️</div>
                <h3>Total Parcels</h3>
                <p className="stat-number">{totalParcels.toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <h3>Pending Transfers</h3>
                <p className="stat-number">{totalPendingTransfers.toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📐</div>
                <h3>Total Area</h3>
                <p className="stat-number">{(totalArea / 10000).toFixed(2)} hectares</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <h3>Average Area</h3>
                <p className="stat-number">{averageArea.toFixed(0)} sq.m</p>
              </div>
            </div>
            
            <div className="overview-section">
              <h2>Recent Activity</h2>
              <div className="activity-grid">
                <div className="activity-card">
                  <h3>Recent Parcels</h3>
                  <div className="recent-list">
                    {parcels.slice(0, 5).map(parcel => (
                      <div key={parcel.id} className="recent-item" onClick={() => handleParcelSelect(parcel)}>
                        <span className="parcel-id">{parcel.survey_number}</span>
                        <span className="parcel-location">{parcel.village}, {parcel.district}</span>
                        <span className="parcel-area">{(parcel.area / 10000).toFixed(2)} ha</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="activity-card">
                  <h3>Pending Transfers</h3>
                  <div className="recent-list">
                    {pendingTransfers.slice(0, 5).map((transfer, index) => (
                      <div key={index} className="recent-item">
                        <span className="transfer-id">{transfer.parcel_id}</span>
                        <span className="transfer-reason">{transfer.reason}</span>
                        <span className="transfer-status">Pending</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Parcels Tab */}
        {activeTab === 'parcels' && (
          <div className="parcels-section">
            <div className="section-header">
              <h2>Land Parcels Management</h2>
              <SearchFilters 
                filters={searchFilters}
                onFiltersChange={setSearchFilters}
              />
            </div>
            
            <div className="parcels-content">
              <div className="parcels-list-container">
                <ParcelList 
                  parcels={filteredParcels}
                  loading={parcelsLoading}
                  onParcelSelect={selectParcel}
                  selectedParcel={selectedParcel}
                  showOwner={true}
                  showActions={true}
                />
              </div>
              
              {selectedParcel && (
                <div className="parcel-details-container">
                  <ParcelDetails 
                    parcel={selectedParcel}
                    onClose={() => selectParcel(null)}
                    showAdminActions={true}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Transfers Tab */}
        {activeTab === 'transfers' && (
          <div className="transfers-section">
            <h2>Transfer Management</h2>
            <TransferManagement 
              transferRequests={transferRequests}
              pendingTransfers={pendingTransfers}
              loading={transfersLoading}
              onTransferAction={handleTransferSuccess}
            />
          </div>
        )}

        {/* Register Parcel Tab */}
        {activeTab === 'register' && (
          <div className="register-section">
            <h2>Register New Land Parcel</h2>
            <ParcelForm 
              onSuccess={handleParcelRegistered}
              mode="register"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
