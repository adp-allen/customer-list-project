import { Table } from './Table';
import { useAuth } from '../AuthContext';

export default function Dashboard() {
    const { logout } = useAuth();

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