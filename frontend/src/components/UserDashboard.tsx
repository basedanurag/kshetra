import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useLandRegistry } from '../hooks/useLandRegistry';
import { LandParcel, TransferRequest } from '../services/LandRegistryService';
import { Principal } from '@dfinity/principal';
import ParcelList from './ParcelList';
import ParcelDetails from './ParcelDetails';
import TransferForm from './TransferForm';
import SearchFilters from './SearchFilters';
import './UserDashboard.css';

type ActiveTab = 'overview' | 'parcels' | 'transfers';

const UserDashboard: React.FC = () => {
  const { principal, userProfile } = useAuth();
  const {
    userParcels,
    selectedParcel,
    loading,
    parcelsLoading,
    error,
    loadUserParcels,
    selectParcel,
    clearError,
    refresh,
    transferOwnership
  } = useLandRegistry();

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [transferParcel, setTransferParcel] = useState<LandParcel | null>(null);
  const [searchFilters, setSearchFilters] = useState<Record<string, string>>({});
  const [filteredParcels, setFilteredParcels] = useState<LandParcel[]>([]);

  // Load user data when component mounts
  useEffect(() => {
    if (principal) {
      loadUserParcels();
    }
  }, [principal, loadUserParcels]);

  // Filter parcels based on search criteria
  useEffect(() => {
    let filtered = userParcels;
    
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
    if (searchFilters.village) {
      filtered = filtered.filter(p => 
        p.village.toLowerCase().includes(searchFilters.village.toLowerCase())
      );
    }
    
    setFilteredParcels(filtered);
  }, [userParcels, searchFilters]);

  // Calculate statistics
  const totalParcels = userParcels.length;
  const totalArea = userParcels.reduce((sum, parcel) => sum + parcel.area, 0);
  const averageArea = totalParcels > 0 ? totalArea / totalParcels : 0;
  const landUseBreakdown = userParcels.reduce((acc, parcel) => {
    acc[parcel.land_use] = (acc[parcel.land_use] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleRefresh = async () => {
    await refresh();
  };

  const handleParcelSelect = (parcel: LandParcel) => {
    selectParcel(parcel);
    setActiveTab('parcels');
  };

  const handleTransferInitiate = (parcel: LandParcel) => {
    setTransferParcel(parcel);
    setShowTransferForm(true);
  };

  const handleTransferSubmit = async (transferData: {
    newOwner: string;
    reason: string;
    transferFee: number;
    documents: string[];
  }) => {
    if (!transferParcel) return false;

    try {
      const newOwnerPrincipal = Principal.fromText(transferData.newOwner);
      const request: TransferRequest = {
        parcel_id: transferParcel.id,
        new_owner: newOwnerPrincipal,
        transfer_fee: BigInt(transferData.transferFee),
        documents: transferData.documents,
        reason: transferData.reason
      };

      const success = await transferOwnership(request);
      if (success) {
        setShowTransferForm(false);
        setTransferParcel(null);
        await loadUserParcels();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Transfer failed:', error);
      return false;
    }
  };

  if (!principal) {
    return (
      <div className="access-denied">
        <h2>Authentication Required</h2>
        <p>Please log in to access your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>My Land Registry</h1>
          <p>Welcome {userProfile?.name || 'User'}, manage your land parcels</p>
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
          My Parcels ({totalParcels})
        </button>
        <button 
          className={`nav-tab ${activeTab === 'transfers' ? 'active' : ''}`}
          onClick={() => setActiveTab('transfers')}
        >
          Transfers
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
                <div className="stat-icon">📐</div>
                <h3>Total Area</h3>
                <p className="stat-number">{(totalArea / 10000).toFixed(2)} hectares</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <h3>Average Area</h3>
                <p className="stat-number">{averageArea.toFixed(0)} sq.m</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">💰</div>
                <h3>Estimated Value</h3>
                <p className="stat-number">₹ {(totalArea * 100).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="overview-section">
              <div className="overview-grid">
                <div className="overview-card">
                  <h3>Land Use Distribution</h3>
                  <div className="land-use-chart">
                    {Object.entries(landUseBreakdown).map(([use, count]) => (
                      <div key={use} className="land-use-item">
                        <span className="land-use-label">{use}</span>
                        <div className="land-use-bar">
                          <div 
                            className="land-use-fill" 
                            style={{ width: `${(count / totalParcels) * 100}%` }}
                          ></div>
                        </div>
                        <span className="land-use-count">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="overview-card">
                  <h3>Recent Parcels</h3>
                  <div className="recent-list">
                    {userParcels.slice(0, 5).map(parcel => (
                      <div key={parcel.id} className="recent-item" onClick={() => handleParcelSelect(parcel)}>
                        <span className="parcel-id">{parcel.survey_number}</span>
                        <span className="parcel-location">{parcel.village}, {parcel.district}</span>
                        <span className="parcel-area">{(parcel.area / 10000).toFixed(2)} ha</span>
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
              <h2>My Land Parcels</h2>
              <SearchFilters 
                filters={searchFilters}
                onFiltersChange={setSearchFilters}
                showOwnerFilter={false}
              />
            </div>
            
            <div className="parcels-content">
              <div className="parcels-list-container">
                <ParcelList 
                  parcels={filteredParcels}
                  loading={parcelsLoading}
                  onParcelSelect={selectParcel}
                  selectedParcel={selectedParcel}
                  showOwner={false}
                  showActions={true}
                  onTransferInitiate={handleTransferInitiate}
                />
              </div>
              
              {selectedParcel && (
                <div className="parcel-details-container">
                  <ParcelDetails 
                    parcel={selectedParcel}
                    onClose={() => selectParcel(null)}
                    showAdminActions={false}
                    onTransferInitiate={() => handleTransferInitiate(selectedParcel)}
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
            <div className="transfer-info">
              <p>Initiate ownership transfers for your land parcels. All transfers require admin approval.</p>
            </div>
            
            <div className="transfer-actions">
              <button 
                className="primary-button"
                onClick={() => setActiveTab('parcels')}
              >
                Select Parcel to Transfer
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Transfer Form Modal */}
      {showTransferForm && transferParcel && (
        <div className="modal-overlay">
          <div className="modal-content">
            <TransferForm 
              parcel={transferParcel}
              onSubmit={handleTransferSubmit}
              onCancel={() => {
                setShowTransferForm(false);
                setTransferParcel(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
