import { useEffect, useState } from 'react'
import { useAuth } from '../AuthContext'
import './LoginModal.css';


interface LoginModalProps {
  onClose: () => void
  onLoginSuccess: () => void
}

const LoginModal = ({ onClose, onLoginSuccess }: LoginModalProps) => {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    setError('')
    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (res.ok && data.token) {
        login(data.token)
        onLoginSuccess()
        onClose()
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <h2 className="modal-title">Login</h2>

        <label className="input-label" htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="input-label" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <div style={{ color: 'red' }}>{error}</div>}

        <button className="login-btn" onClick={handleLogin}>Submit</button>
      </div>
    </div>
  )
}

export default LoginModal
