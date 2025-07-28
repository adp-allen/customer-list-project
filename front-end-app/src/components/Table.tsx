import { useEffect, useState } from 'react';
import './Table.css';

interface Customer {
    id: number;
    name: string;
    email: string;
    password: string;
}

export const Table = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    // Uncomment the following line when AuthContext is implemented
    // const { isLoggedIn } = useAuth();
    const isLoggedIn = false;

    useEffect(() => {
        fetch("/data.json")
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setCustomers(data.customers)
            });
    }, []);

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
                    {customers.map((customer, idx) => (
                        <tr key={idx}>
                            <td>{customer.id}</td>
                            <td>{customer.name}</td>
                            {isLoggedIn && <td>{customer.email}</td>}
                            {isLoggedIn && <td>{customer.password}</td>}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};