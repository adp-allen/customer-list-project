import Home from './components/Home';
import AddUser from './components/AddUser';
import UpdateUser from './components/UpdateUser';
import Dashboard from './components/Dashboard';
import { ProtectedRoute } from './ProtectedRoute';
import { Route, Routes } from 'react-router-dom';
import './App.css';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dash" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
      <Route path="/addUser" element={<ProtectedRoute><AddUser/></ProtectedRoute>} />
      <Route path="/updateUser" element={<ProtectedRoute><UpdateUser id={0}/></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
