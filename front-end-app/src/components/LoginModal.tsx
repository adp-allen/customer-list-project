import { useEffect, useState } from 'react'
import './LoginModal.css';


interface LoginModalProps {
  onClose: () => void
  onLoginSuccess: () => void
}

const LoginModal = ({ onClose, onLoginSuccess }: LoginModalProps) => {
  const [adminUser, setAdminUser] = useState('')
  const [adminPass, setAdminPass] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/admin.json')
      .then((res) => res.json())
      .then((data) => {
        setAdminUser(data.username)
        setAdminPass(data.password)
      })
      .catch((err) => {
        console.error('Failed to load admin credentials:', err)
        setError('System error. Please contact support.')
      })
  }, [])

  const handleLogin = () => {
    if (username === adminUser && password === adminPass) {
      onLoginSuccess()
      onClose()
    } else {
      setError('Invalid username or password')
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
