// src/components/SearchBar.tsx
// src/components/SearchBar.tsx
import type { ChangeEvent } from 'react';

export type FilterKey = 'all' | 'id' | 'name' | 'email' | 'password';

interface SearchBarProps {
  selectedField: FilterKey;
  searchValue: string;
  onFieldChange: (field: FilterKey) => void;
  onSearchChange: (value: string) => void;
}

const SearchBar = ({
  selectedField,
  searchValue,
  onFieldChange,
  onSearchChange
}: SearchBarProps) => {
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFieldChange(e.target.value as FilterKey);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <select value={selectedField} onChange={handleSelectChange}>
        <option value="all">All </option>
        <option value="id">ID</option>
        <option value="name">Name</option>
        <option value="email">Email</option>
        <option value="password">Password</option>
      </select>
      <input
        type="text"
        placeholder={selectedField === 'all' ? 'Search all fields' : `Search by ${selectedField}`}
        value={searchValue}
        onChange={handleInputChange}
        style={{ marginLeft: '0.5rem' }}
      />
    </div>
  );
};

export default SearchBar;
