import React, { useState } from 'react';
import { LandParcel } from '../services/LandRegistryService';
import './TransferForm.css';

interface TransferFormProps {
  parcel: LandParcel;
  onSubmit: (data: {
    newOwner: string;
    reason: string;
    transferFee: number;
    documents: string[];
  }) => Promise<boolean>;
  onCancel: () => void;
}

const TransferForm: React.FC<TransferFormProps> = ({ parcel, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    newOwner: '',
    reason: '',
    transferFee: 0,
    documents: [] as string[]
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: name === 'transferFee' ? Number(value) : value 
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.newOwner.trim()) {
      setError('New owner principal is required');
      return;
    }
    
    if (!formData.reason.trim()) {
      setError('Reason for transfer is required');
      return;
    }
    
    if (formData.transferFee < 0) {
      setError('Transfer fee cannot be negative');
      return;
    }

    setSubmitting(true);
    setError(null);
    
    try {
      const success = await onSubmit(formData);
      if (!success) {
        setError('Transfer submission failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while submitting the transfer.');
      console.error('Transfer error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="transfer-form">
      <div className="form-header">
        <h2>Transfer Ownership</h2>
        <p>Parcel: {parcel.survey_number} ({parcel.village}, {parcel.district})</p>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="newOwner">New Owner Principal *</label>
          <input
            id="newOwner"
            type="text"
            name="newOwner"
            value={formData.newOwner}
            onChange={handleInputChange}
            placeholder="Enter the principal ID of the new owner"
            required
            disabled={submitting}
          />
          <small>The Internet Computer principal ID of the new land owner</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="reason">Reason for Transfer *</label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            placeholder="Provide a reason for this ownership transfer"
            rows={4}
            required
            disabled={submitting}
          />
          <small>Explain why this land is being transferred</small>
        </div>
        
        <div className="form-group">
          <label htmlFor="transferFee">Transfer Fee (₹)</label>
          <input
            id="transferFee"
            type="number"
            name="transferFee"
            value={formData.transferFee}
            onChange={handleInputChange}
            min="0"
            step="1"
            disabled={submitting}
          />
          <small>Optional fee associated with this transfer</small>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Transfer Request'}
          </button>
          <button 
            type="button" 
            className="cancel-button" 
            onClick={onCancel}
            disabled={submitting}
          >
            Cancel
          </button>
        </div>
      </form>
      
      <div className="transfer-info">
        <h4>Important Notes:</h4>
        <ul>
          <li>This transfer request requires admin approval</li>
          <li>Make sure the new owner principal is correct</li>
          <li>Once approved, ownership will be permanently transferred</li>
          <li>All attached documents will transfer with the land</li>
        </ul>
      </div>
    </div>
  );
};

export default TransferForm;

