// Table.tsx
import { useEffect, useState } from 'react';
import './Table.css';
import './Home.css'; // Import the CSS for layout styling
import type { FilterKey } from './SearchBar';
import SearchBar from './SearchBar';

interface Customer {
  id: number;
  name: string;
  email: string;
  password: string;
}

interface TableProps {
  isLoggedIn: boolean;
  selectedField: FilterKey;
  searchValue: string;
  onFieldChange: (field: FilterKey) => void;
  onSearchChange: (value: string) => void;
}

export const Table = ({
  isLoggedIn,
  selectedField,
  searchValue,
  onFieldChange,
  onSearchChange
}: TableProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetch('http://localhost:3000/customers/')
      .then((res) => res.json())
      .then((data) => setCustomers(data));
  }, []);

  // Filter customers based on search
  const filteredCustomers = customers.filter((customer) => {
    if (!searchValue.trim()) return true;

    const search = searchValue.toLowerCase();

    if (selectedField === 'all') {
      return (
        customer.id.toString().toLowerCase().includes(search) ||
        customer.name.toLowerCase().includes(search) ||
        customer.email.toLowerCase().includes(search) ||
        customer.password.toLowerCase().includes(search)
      );
    }

    const fieldValue = customer[selectedField].toString().toLowerCase();
    return fieldValue.includes(search);
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="table-container">
      <div className="table-header-container">
        <div className="search-bar-wrapper">
          <SearchBar
            selectedField={selectedField}
            searchValue={searchValue}
            onFieldChange={onFieldChange}
            onSearchChange={onSearchChange}
          />
        </div>
        <h2 className="table-title">Customer List</h2>
      </div>

      <table className="customer-table">
        <thead>
          <tr>
            <th>ID</th>
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

      <div className="pagination">
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
