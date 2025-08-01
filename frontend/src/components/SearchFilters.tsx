import React from 'react';
import './SearchFilters.css';

interface SearchFiltersProps {
  filters: Record<string, string>;
  onFiltersChange: (filters: Record<string, string>) => void;
  showOwnerFilter?: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ filters, onFiltersChange, showOwnerFilter = true }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onFiltersChange({ ...filters, [name]: value });
  };

  return (
    <div className="search-filters">
      <input
        type="text"
        name="district"
        placeholder="Filter by District"
        value={filters.district || ''}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="state"
        placeholder="Filter by State"
        value={filters.state || ''}
        onChange={handleInputChange}
      />
      <input
        type="text"
        name="land_use"
        placeholder="Filter by Land Use"
        value={filters.land_use || ''}
        onChange={handleInputChange}
      />
      {showOwnerFilter && (
        <input
          type="text"
          name="owner"
          placeholder="Filter by Owner Principal"
          value={filters.owner || ''}
          onChange={handleInputChange}
        />
      )}
    </div>
  );
};

export default SearchFilters;

