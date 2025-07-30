import { useState } from 'react';
import { Table } from './Table';
import LoginModal from './LoginModal';
import { useAuth } from '../AuthContext';

function Home() {
  const { login, isLoggedIn } = useAuth();
  const [showLogin, setShowLogin] = useState(false);

  const handleLoginSuccess = (token?: string) => {
    if (token) login(token);
    setShowLogin(false);
    window.location.assign('/dash');
  };

  const loginHandler = () => {
    if (isLoggedIn) {
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