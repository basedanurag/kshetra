import React, { useState } from 'react';
import { LandParcel } from '../services/LandRegistryService';
import landRegistryService from '../services/LandRegistryService';
import './ParcelDetails.css';

interface ParcelDetailsProps {
  parcel: LandParcel;
  onClose: () => void;
  showAdminActions?: boolean;
  onTransferInitiate?: () => void;
}

const ParcelDetails: React.FC<ParcelDetailsProps> = ({
  parcel,
  onClose,
  showAdminActions = false,
  onTransferInitiate
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'documents' | 'history'>('details');

  const renderCoordinates = () => {
    if (parcel.coordinates.latitude === 0 && parcel.coordinates.longitude === 0) {
      return 'Not specified';
    }
    return `${parcel.coordinates.latitude.toFixed(6)}, ${parcel.coordinates.longitude.toFixed(6)}`;
  };

  const renderMetadata = () => {
    const entries = Object.entries(parcel.metadata);
    if (entries.length === 0) {
      return <p className="no-metadata">No additional metadata available</p>;
    }
    
    return (
      <div className="metadata-grid">
        {entries.map(([key, value]) => (
          <div key={key} className="metadata-item">
            <span className="metadata-key">{key}:</span>
            <span className="metadata-value">{value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="parcel-details">
      <div className="details-header">
        <div className="header-info">
          <h2>{landRegistryService.getParcelDisplayId(parcel)}</h2>
          <p className="survey-info">Survey Number: {parcel.survey_number}</p>
        </div>
        <button className="close-button" onClick={onClose}>×</button>
      </div>

      <div className="details-tabs">
        <button
          className={`tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button
          className={`tab ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          Documents ({parcel.documents.length})
        </button>
        <button
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History
        </button>
      </div>

      <div className="details-content">
        {activeTab === 'details' && (
          <div className="details-tab">
            <div className="detail-section">
              <h3>Location Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Village:</span>
                  <span className="value">{parcel.village}</span>
                </div>
                <div className="detail-item">
                  <span className="label">District:</span>
                  <span className="value">{parcel.district}</span>
                </div>
                <div className="detail-item">
                  <span className="label">State:</span>
                  <span className="value">{parcel.state}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Zone:</span>
                  <span className="value">{parcel.zone}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Coordinates:</span>
                  <span className="value">{renderCoordinates()}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Land Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Area:</span>
                  <span className="value">
                    {landRegistryService.formatArea(parcel.area, 'sqm')} 
                    ({landRegistryService.formatArea(parcel.area, 'hectare')})
                  </span>
                </div>
                <div className="detail-item">
                  <span className="label">Land Use:</span>
                  <span className="value">{parcel.land_use}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Estimated Value:</span>
                  <span className="value">₹ {(parcel.area * 100).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Ownership Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Owner Principal:</span>
                  <span className="value owner-principal">{parcel.owner.toString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Registration Date:</span>
                  <span className="value">{landRegistryService.formatDate(parcel.registration_date)}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Last Updated:</span>
                  <span className="value">{landRegistryService.formatDate(parcel.last_updated)}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Additional Information</h3>
              {renderMetadata()}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="documents-tab">
            <h3>Attached Documents</h3>
            {parcel.documents.length === 0 ? (
              <div className="no-documents">
                <div className="empty-icon">📄</div>
                <p>No documents attached to this parcel</p>
              </div>
            ) : (
              <div className="documents-list">
                {parcel.documents.map((docHash, index) => (
                  <div key={index} className="document-item">
                    <div className="document-info">
                      <span className="document-icon">📄</span>
                      <div className="document-details">
                        <span className="document-name">Document {index + 1}</span>
                        <span className="document-hash">{docHash}</span>
                      </div>
                    </div>
                    <button className="view-document-button">View</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'history' && (
          <div className="history-tab">
            <h3>Parcel History</h3>
            <div className="history-timeline">
              <div className="history-item">
                <div className="history-date">
                  {landRegistryService.formatDate(parcel.registration_date)}
                </div>
                <div className="history-event">
                  <span className="event-type">Registration</span>
                  <span className="event-description">
                    Parcel registered in the land registry system
                  </span>
                </div>
              </div>
              
              {parcel.last_updated !== parcel.registration_date && (
                <div className="history-item">
                  <div className="history-date">
                    {landRegistryService.formatDate(parcel.last_updated)}
                  </div>
                  <div className="history-event">
                    <span className="event-type">Update</span>
                    <span className="event-description">
                      Parcel information was updated
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="details-actions">
        {!showAdminActions && onTransferInitiate && (
          <button className="transfer-button" onClick={onTransferInitiate}>
            🔄 Transfer Ownership
          </button>
        )}
        {showAdminActions && (
          <>
            <button className="edit-button">✏️ Edit Parcel</button>
            <button className="verify-button">✅ Verify Documents</button>
          </>
        )}
        <button className="close-details-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default ParcelDetails;
