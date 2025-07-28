import Home from './components/Home';
import AddUser from './components/AddUser';
import UpdateUser from './components/UpdateUser';
import { Route, Routes } from 'react-router-dom';
import './App.css';


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/addUser" element={<AddUser />} />
      <Route path="/updateUser" element={<UpdateUser />} />
    </Routes>
  );
}

export default App;
