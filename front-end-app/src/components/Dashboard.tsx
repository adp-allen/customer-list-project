import { Table } from './Table';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';


export default function Dashboard() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const logOut = () => {
        logout();
        window.location.assign('/');
    }

    return (
        <div className="container-fluid">
            <button
                className="auth-btn"
                onClick={logOut}
            >
                Logout
            </button>
            <Table isLoggedIn={true} />
        </div>
    );
}