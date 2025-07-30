

// Dashboard.tsx
import { useState } from 'react';
import SearchBar, { type FilterKey } from './SearchBar';
import { Table } from './Table';
import { useAuth } from '../AuthContext';
import ImportData from './ImportData';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [showExport, changeShowExport] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [selectedField, setSelectedField] = useState<FilterKey>('all');
  const [searchValue, setSearchValue] = useState('');

  const logOut = () => {
    logout();
    window.location.assign('/');
  };

  const toggleShowExport = () => {
    changeShowExport(true);
  };

  return (
    <div className="container-fluid">
      <div className="dashboard-header">
        <button className="auth-btn" onClick={logOut}>
          Logout
        </button>
        <button className="export-btn" onClick={toggleShowExport}>
          Export Data
        </button>
      </div>

      <ImportData show={showExport} onCancel={() => changeShowExport(false)} />

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

