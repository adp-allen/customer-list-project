import './App.css';
import AddUser from './components/AddUser'
import UpdateUser from './components/UpdateUser'
import { Route, Routes, Navigate, Link} from 'react-router'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/addUser" element={<AddUser />} />
        <Route path="/updateUser" element={<UpdateUser />} />
      </Routes>
    </div>
  );
}
export default App;
