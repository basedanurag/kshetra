import React, { useState } from 'react';
import { TransferRequest } from '../services/LandRegistryService';
import { useLandRegistry } from '../hooks/useLandRegistry';
import './TransferManagement.css';

interface TransferManagementProps {
  transferRequests: TransferRequest[];
  pendingTransfers: TransferRequest[];
  loading: boolean;
  onTransferAction: () => void;
}

const TransferManagement: React.FC<TransferManagementProps> = ({
  transferRequests,
  pendingTransfers,
  loading,
  onTransferAction
}) => {
  const { approveTransfer, rejectTransfer } = useLandRegistry();
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [processing, setProcessing] = useState<string | null>(null);

  const handleApproveTransfer = async (transfer: TransferRequest) => {
    setProcessing(transfer.parcel_id);
    try {
      const success = await approveTransfer(transfer.parcel_id, transfer.new_owner);
      if (success) {
        onTransferAction();
      }
    } catch (error) {
      console.error('Failed to approve transfer:', error);
    } finally {
      setProcessing(null);
    }
  };

  const handleRejectTransfer = async (transfer: TransferRequest, reason: string) => {
    setProcessing(transfer.parcel_id);
    try {
      const success = await rejectTransfer(transfer.parcel_id, reason);
      if (success) {
        onTransferAction();
      }
    } catch (error) {
      console.error('Failed to reject transfer:', error);
    } finally {
      setProcessing(null);
    }
  };

  const currentTransfers = activeTab === 'pending' ? pendingTransfers : transferRequests;

  if (loading) {
    return (
      <div className="transfer-management-loading">
        <div className="loading-spinner"></div>
        <p>Loading transfers...</p>
      </div>
    );
  }

  return (
    <div className="transfer-management">
      <div className="transfer-tabs">
        <button
          className={`tab ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({pendingTransfers.length})
        </button>
        <button
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Requests ({transferRequests.length})
        </button>
      </div>

      <div className="transfer-list">
        {currentTransfers.length === 0 ? (
          <div className="empty-transfers">
            <div className="empty-icon">📋</div>
            <h3>No transfer requests</h3>
            <p>There are no transfer requests to display.</p>
          </div>
        ) : (
          currentTransfers.map((transfer, index) => (
            <div key={index} className="transfer-item">
              <div className="transfer-header">
                <h4>Parcel ID: {transfer.parcel_id}</h4>
                <span className="transfer-status pending">Pending</span>
              </div>
              
              <div className="transfer-details">
                <div className="detail-row">
                  <span className="label">New Owner:</span>
                  <span className="value">{transfer.new_owner.toString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Transfer Fee:</span>
                  <span className="value">₹ {transfer.transfer_fee.toString()}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Reason:</span>
                  <span className="value">{transfer.reason}</span>
                </div>
                {transfer.documents.length > 0 && (
                  <div className="detail-row">
                    <span className="label">Documents:</span>
                    <span className="value">{transfer.documents.length} attached</span>
                  </div>
                )}
              </div>

              {activeTab === 'pending' && (
                <div className="transfer-actions">
                  <button
                    className="approve-button"
                    onClick={() => handleApproveTransfer(transfer)}
                    disabled={processing === transfer.parcel_id}
                  >
                    {processing === transfer.parcel_id ? 'Processing...' : '✅ Approve'}
                  </button>
                  <button
                    className="reject-button"
                    onClick={() => handleRejectTransfer(transfer, 'Rejected by admin')}
                    disabled={processing === transfer.parcel_id}
                  >
                    {processing === transfer.parcel_id ? 'Processing...' : '❌ Reject'}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TransferManagement;
