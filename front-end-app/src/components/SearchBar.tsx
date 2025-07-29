// SearchBar.tsx
// SearchBar.tsx
import type { ChangeEvent } from 'react';

export type FilterKey = 'all' | 'id' | 'name' | 'email' | 'password';

interface SearchBarProps {
  selectedField: FilterKey;
  searchValue: string;
  onFieldChange: (field: FilterKey) => void;
  onSearchChange: (value: string) => void;
  allowedFields?: FilterKey[]; // optional filter fields to show in dropdown
}

const SearchBar = ({
  selectedField,
  searchValue,
  onFieldChange,
  onSearchChange,
  allowedFields = ['all', 'id', 'name', 'email', 'password'],
}: SearchBarProps) => {
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFieldChange(e.target.value as FilterKey);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="search-bar-container">
      <select value={selectedField} onChange={handleSelectChange} className="search-select">
        {allowedFields.map((field) => (
          <option key={field} value={field}>
            {field === 'all' ? 'All Fields' : field.charAt(0).toUpperCase() + field.slice(1)}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder={selectedField === 'all' ? 'Search all fields' : `Search by ${selectedField}`}
        value={searchValue}
        onChange={handleInputChange}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
