import { useState } from 'react';
import './App.css';
import { Table } from './components/Table';
import LoginModal from './components/LoginModal';
import './components/LoginModal.css';
import { useAuth } from './AuthContext';
import './App.css';
import AddUser from './components/AddUser'
import UpdateUser from './components/UpdateUser'
import { Route, Routes, Navigate, Link} from 'react-router'


function App() {
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
      <Routes>
        <Route path="/addUser" element={<AddUser />} />
        <Route path="/updateUser" element={<UpdateUser />} />
      </Routes>
      <button onClick={isLoggedIn ? logout : login}>
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

export default App;
