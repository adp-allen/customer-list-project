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
        const token = localStorage.getItem('authToken')
        console.log(JSON.stringify(user))
        try {
            const res = await fetch('http://localhost:3000/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token || ''
                },
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

    const handleAttach = (e: React.FormEvent, event: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const file = event.target.files?.[0];
        if (!file) {
            alert('No file selected');
            return;
        }
        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target?.result as string;
            try {
                // Send the raw CSV data to the backend
                const response = await fetch('http://localhost:3000/api/customers', {
                    method: 'POST',
                    headers: {'Content-Type': 'text/plain'},
                    body: text,
                });
    
                if (response.ok) {
                    alert('Customers added successfully!');
                    localStorage.removeItem('customerData');
                    localStorage.removeItem('customerDataTimestamp');
                    navigate('/dash');
                } else {
                    alert('Failed to add customers');
                }
            } catch (error) {
                alert('An error occurred while adding customers');
            }
        };
    
        reader.onerror = () => {
            alert('Failed to read file');
        };
    
        reader.readAsText(file);
    };


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
                <button
                    className='add-user-attach-button'
                    onClick={() => document.getElementById('file-input')?.click()}
                >
                    Attach csv
                </button>
                <input
                    id='file-input'
                    type='file'
                    accept='.csv'
                    style={{ display: 'none' }}
                    onChange={() => handleAttach}
                />
                <button className='add-user-save-button' onClick={handleSave}>Save</button>
            </div>
        </div>
    )
}

export default AddUser;