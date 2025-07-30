// Home.tsx
import { useState } from 'react';
import { Table } from './Table';
import LoginModal from './LoginModal';
import { useAuth } from '../AuthContext';
import type { FilterKey } from './SearchBar';

function Home() {
  const { login } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  const [selectedField, setSelectedField] = useState<FilterKey>('all');
  const [searchValue, setSearchValue] = useState('');

  const handleLoginSuccess = () => {
    login();
    setShowLogin(false);
    window.location.assign('/dash');
  };

  const loginHandler = () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      window.location.assign('/dash');
    } else {
      setShowLogin(true);
    }
  };

  return (
    <div className="container-fluid">
      <button className="auth-btn" onClick={loginHandler}>
        Login
      </button>

      <Table
        isLoggedIn={false}
        selectedField={selectedField}
        searchValue={searchValue}
        onFieldChange={setSelectedField}
        onSearchChange={setSearchValue}
      />

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

export default Home;

