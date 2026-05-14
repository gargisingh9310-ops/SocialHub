import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { validatePassword, validateEmail, validateUserName } from '../utils/validation'
import { User, Mail, Lock, Loader } from 'lucide-react'
import '../stylesheet/Register.css'

export default function Register() {

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [passwordErrors, setPasswordErrors] = useState([])

  const navigate = useNavigate()

  // ✅ ENV API URL
  const API = import.meta.env.VITE_API_URL

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })

    if (name === 'password') {
      setPasswordErrors(validatePassword(value))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // VALIDATIONS
    if (!form.firstName.trim()) {
      setError('First name required')
      setLoading(false)
      return
    }

    if (!form.userName.trim()) {
      setError('Username required')
      setLoading(false)
      return
    }

    const userNameError = validateUserName(form.userName)
    if (userNameError) {
      setError(userNameError)
      setLoading(false)
      return
    }

    if (!validateEmail(form.email)) {
      setError('Invalid email')
      setLoading(false)
      return
    }

    if (passwordErrors.length > 0) {
      setError('Password: ' + passwordErrors.join(', '))
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${API}/users/register`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Registration failed')
        return
      }

      navigate('/verify-otp', {
        state: {
          userId: data.userId,
          email: data.email
        }
      })

    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">

      <div className="auth-box">

        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <User size={16} />
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <User size={16} />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <User size={16} />
            <input
              type="text"
              name="userName"
              placeholder="Username"
              value={form.userName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <Mail size={16} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <Lock size={16} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* PASSWORD ERRORS */}
          {passwordErrors.length > 0 && (
            <div className="password-errors">
              {passwordErrors.map((err, idx) => (
                <p key={idx} className="password-error-item">
                  • {err}
                </p>
              ))}
            </div>
          )}

          {/* ERROR */}
          {error && <p className="error">{error}</p>}

          {/* BUTTON */}
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? <Loader className="spin" size={18} /> : 'Register'}
          </button>

        </form>

        <p className="auth-link">
          Have account? <a href="/login">Login</a>
        </p>

      </div>

    </div>
  )
}