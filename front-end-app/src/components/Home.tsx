import { useState } from 'react';
import { Table } from './Table';
import LoginModal from './LoginModal';
import { useAuth } from '../AuthContext';

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
      <Table isLoggedIn={false} />
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