import { useState } from 'react';
import { Table } from './Table';
import LoginModal from './LoginModal';
import { useAuth } from '../AuthContext';
import type { FilterKey } from './SearchBar';

function Home() {
  const { login } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginSuccess = () => {
    login();
    setShowLogin(false);
    window.location.assign('/dash');
  };

  const loginHandler = () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
      window.location.assign('/dash')
    } else {
      setShowLogin(true)
    }
  }

  return (
    <div className="container-fluid">
      <button
        className="auth-btn"
        onClick={loginHandler}
      >
        Login
      </button>
   <Table isLoggedIn={false} selectedField="name" searchValue="" onFieldChange={function (): void {
        throw new Error('Function not implemented.');
      } } onSearchChange={function (value: string): void {
        throw new Error('Function not implemented.');
      } } />


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