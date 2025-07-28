import { useState } from 'react';
import { Table } from './Table';
import LoginModal from './LoginModal';
import { useAuth } from '../AuthContext';

function Home() {
  const { isLoggedIn, login, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginSuccess = () => {
    login();
    setShowLogin(false);
  };

  return (
    <div className="container-fluid">
      <button
        className="auth-btn"
        onClick={isLoggedIn ? logout : () => setShowLogin(true)}
      >
        {isLoggedIn ? 'Logout' : 'Login'}
      </button>
      <Table isLoggedIn={isLoggedIn} />
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