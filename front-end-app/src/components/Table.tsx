// Table.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Table.css';
import SearchBar, { type FilterKey } from './SearchBar';

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
  onSearchChange,
}: TableProps) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = useNavigate();

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await fetch('http://localhost:3000/customers/');
        const data = await res.json();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
        setCustomers([]);
      }
    };
    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    if (!searchValue.trim()) return true;

    const search = searchValue.toLowerCase();

    if (selectedField === 'all') {
      if (isLoggedIn) {
        return (
          customer.id.toString().includes(search) ||
          customer.name.toLowerCase().includes(search) ||
          customer.email.toLowerCase().includes(search) ||
          customer.password.toLowerCase().includes(search)
        );
      } else {
        return (
          customer.id.toString().includes(search) ||
          customer.name.toLowerCase().includes(search)
        );
      }
    }

    if (!isLoggedIn && (selectedField === 'email' || selectedField === 'password')) {
      return true;
    }

    const fieldValue = customer[selectedField].toString().toLowerCase();
    return fieldValue.includes(search);
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleRowClick = (id: number) => {
    setSelectedId((prevSelectedId) => (prevSelectedId === id ? null : id));
  };
  
  const handleUpdateClick = () => {
    if (selectedId !== null) {
      navigate(`/updateUser?id=${selectedId}`);
    } else {
      alert('Please select a user to update.');
    }
  };

  return (
    <div className="table-container">
      <h2 className="table-title">Customer List</h2>

      <div className="table-action-buttons" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
  <div className="search-bar-wrapper" style={{ flexGrow: 1 }}>
    <SearchBar
      selectedField={selectedField}
      searchValue={searchValue}
      onFieldChange={onFieldChange}
      onSearchChange={onSearchChange}
    />
  </div>

  <div className="button-group" style={{ display: 'flex', gap: '0.5rem' }}>
    {isLoggedIn && (
      <button className="add-user-button" onClick={() => navigate('/addUser')}>
        Add User
      </button>
    )}
    {isLoggedIn && (
      <button
        className="update-user-button"
        onClick={handleUpdateClick}
        disabled={selectedId === null}
        style={{
          backgroundColor: selectedId === null ? '#cccccc' : '#1e90ff',
          cursor: selectedId === null ? 'not-allowed' : 'pointer',
        }}
      >
        Update User
      </button>
    )}
  </div>
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
          {currentCustomers.map((customer) => (
            <tr
              key={customer.id}
              className={selectedId === customer.id ? 'selected-row' : ''}
              onClick={() => handleRowClick(customer.id)}
              style={{ cursor: 'pointer' }}
            >
              <td>{selectedId === customer.id ? <b>{customer.id}</b> : customer.id}</td>
              <td>{customer.name}</td>
              {isLoggedIn && <td>{customer.email}</td>}
              {isLoggedIn && <td>{customer.password}</td>}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination" data-testid="pagination">
        <button
          className="page-button"
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
          className="page-button"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

