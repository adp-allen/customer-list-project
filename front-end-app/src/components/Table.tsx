import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Table.css';

interface Customer {
    id: number;
    name: string;
    email: string;
    password: string;
}

interface TableProps {
    isLoggedIn: boolean; 
}

export const Table = ({ isLoggedIn }: TableProps) => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => { 
        fetch('http://localhost:3000/customers/')
            .then((res) => res.json())
            .then((data) => setCustomers(data));
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCustomers = customers.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(customers.length / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const handleRowClick = (id: number) => {
        setSelectedId(id);
    };

    const handleUpdateClick = () => {
        if (selectedId !== null) {
            navigate(`/updateUser?id=${selectedId}`);
        } else {
            alert('Please select a user to update.');
        }
    };

    return (
        <div className='table-container'>
            <h2 className='table-title'>Customer List</h2>
            <div className='table-action-buttons'>
                {isLoggedIn &&<button className='add-user-button' onClick={() => navigate('/addUser')}>Add User</button>}
                {isLoggedIn &&
                <button
                    className='update-user-button'
                    onClick={handleUpdateClick}
                           disabled={selectedId === null || selectedId === undefined}
                    style={{
                    backgroundColor:
                        selectedId === null || selectedId === undefined
                            ? '#cccccc'
                            : '#1e90ff',
                    cursor:
                        selectedId === null || selectedId === undefined
                            ? 'not-allowed'
                            : 'pointer'
                    }}  
                >Update User</button>}
            </div>
            <table className='customer-table'>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Name</th>
                        {isLoggedIn && <th>Email</th>}
                        {isLoggedIn && <th>Password</th>}
                    </tr>
                </thead>
                <tbody>
                    {currentCustomers.map((customer) => (
                        <tr
                            key={customer.id}
                            className={selectedId === customer.id ? 'selected-row' : ''}
                            onClick={() => handleRowClick(customer.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <td>
                                {selectedId === customer.id ? <b>{customer.id}</b> : customer.id}
                            </td>
                            <td>{customer.name}</td>
                            {isLoggedIn && <td>{customer.email}</td>}
                            {isLoggedIn && <td>{customer.password}</td>}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='pagination'>
                <button
                    className='page-button'
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    &lt;
                </button>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    className='page-button'
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                    &gt;
                </button>
            </div>
        </div>
    );
};