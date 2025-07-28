import { useEffect, useState } from 'react';
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
  
    useEffect(() => {
      fetch('/data.json')
        .then((res) => res.json())
        .then((data) => setCustomers(data.customers));
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

    return (
        <div className='table-container'>
            <h2 className='table-title'>Customer List</h2>
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
                    {currentCustomers.map((customer, idx) => (
                        <tr key={idx}>
                            <td>{customer.id}</td>
                            <td>{customer.name}</td>
                            {isLoggedIn && <td>{customer.email}</td>}
                            {isLoggedIn && <td>{customer.password}</td>}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='pagination'>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        className={`page-button ${currentPage === index + 1 ? 'active' : ''}`}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};