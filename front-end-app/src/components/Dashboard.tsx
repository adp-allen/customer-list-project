// Dashboard.tsx
import { useState } from 'react';
import SearchBar, { type FilterKey } from './SearchBar';
import { Table } from './Table';
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
      <button className="auth-btn" onClick={logOut}>
        Logout
      </button>

      <div className="table-header-container">
        <div className="search-bar-wrapper">
          <SearchBar
            selectedField={selectedField}
            searchValue={searchValue}
            onFieldChange={setSelectedField}
            onSearchChange={setSearchValue}
          />
        </div>

        <h2 className="table-title">Customer List</h2>
      </div>

      <Table isLoggedIn={true} selectedField={selectedField} searchValue={searchValue} />
    </div>
  );
}
