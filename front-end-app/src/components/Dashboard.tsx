// Dashboard.tsx
import { useState } from 'react';
import { Table } from './Table';
import { type FilterKey } from './SearchBar';
import { useAuth } from '../AuthContext';

export default function Dashboard() {
  const { logout } = useAuth();

  const [selectedField, setSelectedField] = useState<FilterKey>('all');
  const [searchValue, setSearchValue] = useState('');

  const logOut = () => {
    logout();
    window.location.assign('/');
  };

  return (
    <div className="container-fluid">
      <button className="auth-btn" onClick={logOut}>Logout</button>
      <Table
        isLoggedIn={true}
        selectedField={selectedField}
        searchValue={searchValue}
        onFieldChange={setSelectedField}
        onSearchChange={setSearchValue}
      />
    </div>
  );
}
