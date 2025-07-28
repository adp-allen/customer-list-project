import { useState } from 'react';
import { Table } from './components/Table';
import LoginModal from './components/LoginModal';
import './components/LoginModal.css';


function App() {
  const [showLogin, setShowLogin] = useState(false);

  // Uncomment the following line when AuthContext is implemented
  // const { isLoggedIn, logout, login } = useAuth();
  const isLoggedIn = false;
  const logout: any = undefined;
  const login: any = undefined;

  return (
    <div className="container-fluid">
      <button onClick={isLoggedIn ? logout : () => setShowLogin(true)}>
        {isLoggedIn ? 'Logout' : 'Login'}
      </button>
      <Table />
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}

export default App;