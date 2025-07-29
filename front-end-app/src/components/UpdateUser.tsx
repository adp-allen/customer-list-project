import './UpdateUser.css'
import { useState } from 'react'

function UpdateUser({ id }: { id: number }) {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = window.location ? (path: string) => window.location.assign(path) : () => {}

    const handleUpdate = async () => {
        const user = { name, email, password }
        try {
            const res = await fetch(`http://localhost:3000/customers/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            })
            if (res.ok) navigate('/')
        } catch (err) {
            alert('Failed to update user')
        }
    }

    const handleDelete = async () => {
        try {
            const res = await fetch(`http://localhost:3000/customers/${id}`, {
                method: 'DELETE'
            })
            if (res.ok) navigate('/')
        } catch (err) {
            alert('Failed to delete user')
        }
    }

    const handleCancel = () => {
        navigate('/')
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
        </div>
    )
}

export default UpdateUser