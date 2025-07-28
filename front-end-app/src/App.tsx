import { Table } from './components/Table';
import './App.css';
import AddUser from './components/AddUser'
import UpdateUser from './components/UpdateUser'
import { Route, Routes, Navigate, Link} from 'react-router'

function App() {
  // Uncomment the following line when AuthContext is implemented
  // const { isLoggedIn, logout, login } = useAuth();
  const isLoggedIn = false;
  const logout: any = undefined;
  const login: any = undefined;

  return (
    <div className="container-fluid">
      <Routes>
        <Route path="/addUser" element={<AddUser />} />
        <Route path="/updateUser" element={<UpdateUser />} />
      </Routes>
      <button onClick={isLoggedIn ? logout : login}>
        {isLoggedIn ? 'Logout' : 'Login'}
      </button>
      <Table />
    </div>
  );
}

export default App;