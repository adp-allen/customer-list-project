import { Table } from './components/Table';


function App() {
  // Uncomment the following line when AuthContext is implemented
  // const { isLoggedIn, logout, login } = useAuth();
  const isLoggedIn = false;
  const logout: any = undefined;
  const login: any = undefined;

  return (
    <div className="container-fluid">
      <button onClick={isLoggedIn ? logout : login}>
        {isLoggedIn ? 'Logout' : 'Login'}
      </button>
      <Table />
    </div>
  );
}

export default App;