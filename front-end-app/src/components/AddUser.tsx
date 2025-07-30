import { useState } from 'react'
import './AddUser.css'

function AddUser() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = window.location ? (path: string) => window.location.assign(path) : () => {}

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const user = { name, email, password }
        try {
            const res = await fetch('http://localhost:3000/customers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            })
            if (res.ok) {
                localStorage.removeItem('customerData');
                localStorage.removeItem('customerDataTimestamp');
                navigate('/dash')
            }
        } catch (err) {
            alert('Failed to add user')
        }
    }

    const handleCancel = () => {
        navigate('/dash')
    }

    return (
        <div className='add-user-container'>
            <h1>Add User Page</h1>
            <div className='add-user-body'>
                <p>Customer Name</p>
                <input type='text' value={name} onChange={e => setName(e.target.value)} />

                <p>Email</p>
                <input 
                    type='email' 
                    value={email} 
                    onChange={e => {
                        setEmail(e.target.value);
                        const emailErrorElement = document.getElementById('email-error');
                        if (emailErrorElement && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) {
                            emailErrorElement.textContent = '';
                        }
                    }} 
                    onBlur={() => {
                        const emailErrorElement = document.getElementById('email-error');
                        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && emailErrorElement) {
                            emailErrorElement.textContent = 'Please enter a valid email address';
                        }
                    }}
                />
                <span id="email-error" className="error-message" style={{ color: 'red' }}></span>

                <p>Password</p>
                <input type='password' value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <div className='add-user-buttons'>
                <button className='add-user-cancel-button' onClick={handleCancel}>Cancel</button>
                <button className='add-user-save-button' onClick={handleSave}>Save</button>
            </div>
        </div>
    )
}

export default AddUser;