// Table.tsx
import React, { useEffect, useState } from 'react';
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
  const [lastFetched, setLastFetched] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const navigate = useNavigate();

  const CACHE_EXPIRY = 5 * 60 * 1000;

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const cachedData = localStorage.getItem("customerData")
        const cachedTimestamp = localStorage.getItem("customerDataTimestamp");
        if (cachedData && cachedTimestamp) {
          const timestamp = parseInt(cachedTimestamp, 10);
          const now = Date.now();
          if (now - timestamp < CACHE_EXPIRY) {
            setCustomers(JSON.parse(cachedData));
            setLastFetched(timestamp);
            setLoading(false);
            return;
          }
        }
        // Cache expired or invalidated, fetch fresh data
        const res = await fetch('http://localhost:3000/customers/');
        const data = await res.json();
        setCustomers(data);
        localStorage.setItem("customerData", JSON.stringify(data));
        localStorage.setItem("customerDataTimestamp", Date.now().toString());
        setLastFetched(Date.now());

      } catch (error) {
        console.error('Error fetching customers:', error);
        // If fetch fails, try to use cached data
        const cachedData = localStorage.getItem("customerData");
        if (cachedData) {
          setCustomers(JSON.parse(cachedData));
        } else {
          setCustomers([]);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [])

  useEffect(() => {
    setCurrentPage(1); // Reset to the first page when searchValue or selectedField changes
  }, [searchValue, selectedField]);
  
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
  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = parseInt(e.target.value, 10);
    setItemsPerPage(newValue);
    setCurrentPage(1); // Reset to the first page when items per page changes
  };

  return (
    <div className="table-container">
      <h2 className="table-title">Customer List</h2>
      {lastFetched && (
        <div className="cache-info">
          Last updated: {new Date(lastFetched).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: "numeric", hour: '2-digit', minute: "2-digit" })}
        </div>
      )}
      {loading ? (
        <div className='loading'>Loading...</div>
      ) : (
        <>
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
              <div className="items-per-page-container">
                <label htmlFor="items-per-page">Items per page:</label>
                <select
                  id="items-per-page"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className='items-per-page-select'
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                </select>
              </div>
            <button
              className="page-button"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              &lt;
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
              const startPage = Math.max(1, currentPage - 2);
              const pageNumber = startPage + index;
              if (pageNumber > totalPages) return null;
              return (
              <button
                key={pageNumber}
                className={`page-button ${currentPage === pageNumber ? 'active' : ''}`}
                onClick={() => handlePageChange(pageNumber)}
              >
                {pageNumber}
              </button>
              );
            })}
            <button
              className="page-button"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              &gt;
            </button>
            </div>
        </>
      )}
    </div>
  );
};
