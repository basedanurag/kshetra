import React from 'react';
import { LandParcel } from '../services/LandRegistryService';
import landRegistryService from '../services/LandRegistryService';
import './ParcelList.css';

interface ParcelListProps {
  parcels: LandParcel[];
  loading: boolean;
  onParcelSelect: (parcel: LandParcel) => void;
  selectedParcel: LandParcel | null;
  showOwner?: boolean;
  showActions?: boolean;
  onTransferInitiate?: (parcel: LandParcel) => void;
}

const ParcelList: React.FC<ParcelListProps> = ({
  parcels,
  loading,
  onParcelSelect,
  selectedParcel,
  showOwner = false,
  showActions = false,
  onTransferInitiate
}) => {
  if (loading) {
    return (
      <div className="parcel-list-loading">
        <div className="loading-spinner"></div>
        <p>Loading parcels...</p>
      </div>
    );
  }

  if (parcels.length === 0) {
    return (
      <div className="parcel-list-empty">
        <div className="empty-icon">🏞️</div>
        <h3>No parcels found</h3>
        <p>No land parcels match your current filters.</p>
      </div>
    );
  }

  const handleTransferClick = (e: React.MouseEvent, parcel: LandParcel) => {
    e.stopPropagation();
    if (onTransferInitiate) {
      onTransferInitiate(parcel);
    }
  };

  return (
    <div className="parcel-list">
      <div className="parcel-list-header">
        <h3>Land Parcels ({parcels.length})</h3>
      </div>
      
      <div className="parcel-list-content">
        {parcels.map((parcel) => (
          <div
            key={parcel.id}
            className={`parcel-item ${selectedParcel?.id === parcel.id ? 'selected' : ''}`}
            onClick={() => onParcelSelect(parcel)}
          >
            <div className="parcel-main-info">
              <div className="parcel-header">
                <h4 className="parcel-id">
                  {landRegistryService.getParcelDisplayId(parcel)}
                </h4>
                <span className="parcel-survey">Survey: {parcel.survey_number}</span>
              </div>
              
              <div className="parcel-location">
                <span className="location-icon">📍</span>
                <span>{parcel.village}, {parcel.district}, {parcel.state}</span>
              </div>
              
              <div className="parcel-details">
                <div className="detail-item">
                  <span className="detail-label">Area:</span>
                  <span className="detail-value">
                    {landRegistryService.formatArea(parcel.area, 'hectare')}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Land Use:</span>
                  <span className="detail-value">{parcel.land_use}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Zone:</span>
                  <span className="detail-value">{parcel.zone}</span>
                </div>
                {showOwner && (
                  <div className="detail-item">
                    <span className="detail-label">Owner:</span>
                    <span className="detail-value owner-principal">
                      {parcel.owner.toString().substring(0, 20)}...
                    </span>
                  </div>
                )}
              </div>
              
              <div className="parcel-dates">
                <span className="date-item">
                  Registered: {landRegistryService.formatDate(parcel.registration_date)}
                </span>
                <span className="date-item">
                  Updated: {landRegistryService.formatDate(parcel.last_updated)}
                </span>
              </div>
            </div>
            
            {showActions && (
              <div className="parcel-actions">
                <button 
                  className="action-button view-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onParcelSelect(parcel);
                  }}
                >
                  View Details
                </button>
                {onTransferInitiate && (
                  <button 
                    className="action-button transfer-button"
                    onClick={(e) => handleTransferClick(e, parcel)}
                  >
                    Transfer
                  </button>
                )}
              </div>
            )}
            
            <div className="parcel-status">
              <div className="status-indicators">
                {parcel.documents.length > 0 && (
                  <span className="status-badge documents">
                    📄 {parcel.documents.length} docs
                  </span>
                )}
                <span className="status-badge verified">✅ Verified</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ParcelList;
