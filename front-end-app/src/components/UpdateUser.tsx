import { useSearchParams } from 'react-router-dom';
import './UpdateUser.css'
import { useState, useEffect } from 'react'
import ConfirmModal from './ConfirmModal';

function UpdateUser() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get('id');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = window.location ? (path: string) => window.location.assign(path) : () => {}

    // Fetch user data when component mounts
    useEffect(() => {
        if (id) {
            const token = localStorage.getItem('authToken')
            fetch(`http://localhost:3000/customers/${id}`, {
                headers: {
                    'Authorization': token || ''
                }
            })
                .then(res => res.json())
                .then(data => {
                    setName(data.name || '');
                    setEmail(data.email || '');
                    setPassword(data.password || '');
                })
                .catch(() => {
                    alert('Failed to fetch user data');
                });
        }
    }, [id]);

    const handleUpdate = async () => {
        const user = { name, email, password }
        const token = localStorage.getItem('authToken')
        try {
            const res = await fetch(`http://localhost:3000/customers/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token || ''
                },
                body: JSON.stringify(user)
            })
            if (res.ok) navigate('/dash')
        } catch (err) {
            alert('Failed to update user')
        }
    }

    const handleDelete = async () => {
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        setShowConfirm(false);
        const token = localStorage.getItem('authToken')
        try {
            const res = await fetch(`http://localhost:3000/customers/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token || ''
                }
            });
            if (res.ok) navigate('/dash');
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const handleCancel = () => {
        navigate('/dash')
    }

    return (
        <div className='update-user-container'>
            <h1>Update User Page</h1>
            <div className='update-user-body'>
                <p>Customer Name</p>
                <input type='text' value={name} onChange={e => setName(e.target.value)} />

                <p>Email</p>
                <input type='text' value={email} onChange={e => setEmail(e.target.value)} />

                <p>Password</p>
                <input type='text' value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className='update-user-buttons'>
                <button className='update-user-cancel-button' onClick={handleCancel}>Cancel</button>
                <button className='update-user-save-button' onClick={handleUpdate}>Save</button>
                <button className='update-user-delete-button' onClick={handleDelete}>Delete</button>
            </div>
            {showConfirm && (
                <ConfirmModal
                    message="Are you sure you want to delete this user?"
                    onConfirm={confirmDelete}
                    onCancel={() => setShowConfirm(false)}
                />
            )}
        </div>
    )
}

export default UpdateUser