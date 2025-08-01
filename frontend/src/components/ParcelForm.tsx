import React, { useState } from 'react';
import './ParcelForm.css';

interface ParcelFormProps {
  onSuccess: () => void;
  mode: 'register' | 'update';
}

const ParcelForm: React.FC<ParcelFormProps> = ({ onSuccess, mode }) => {
  const [formData, setFormData] = useState({
    survey_number: '',
    village: '',
    district: '',
    state: '',
    area: 0,
    land_use: '',
    zone: '',
    coordinates: { latitude: 0, longitude: 0 },
    documents: []
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement submission logic
    onSuccess();
  };

  return (
    <div className="parcel-form">
      <h2>{mode === 'register' ? 'Register New Parcel' : 'Update Parcel'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Survey Number</label>
          <input
            type="text"
            name="survey_number"
            value={formData.survey_number}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Village</label>
          <input
            type="text"
            name="village"
            value={formData.village}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>District</label>
          <input
            type="text"
            name="district"
            value={formData.district}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Area (sq.m)</label>
          <input
            type="number"
            name="area"
            value={formData.area}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Land Use</label>
          <input
            type="text"
            name="land_use"
            value={formData.land_use}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Zone</label>
          <input
            type="text"
            name="zone"
            value={formData.zone}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Latitude</label>
          <input
            type="number"
            name="latitude"
            value={formData.coordinates.latitude}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-group">
          <label>Longitude</label>
          <input
            type="number"
            name="longitude"
            value={formData.coordinates.longitude}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit" className="submit-button">
          {mode === 'register' ? 'Register Parcel' : 'Update Parcel'}
        </button>
      </form>
    </div>
  );
};

export default ParcelForm;

