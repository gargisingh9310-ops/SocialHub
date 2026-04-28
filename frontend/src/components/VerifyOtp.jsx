import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { login } from '../redux/authActions'
import '../stylesheet/VerifyOtp.css'

export default function VerifyOtp() {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userId, email } = useLocation().state || {}

  if (!userId) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <p className="error">Invalid access. Please register first.</p>
        </div>
      </div>
    )
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('https://social-hub-sqid.onrender.com/api/users/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, otp })
      })

      const data = await res.json()
      
      if (!res.ok) {
        setError(data.message)
        return
      }

      // Login with token
      dispatch(login(data.token, { userId: data.userId, userName: data.userName }))
      navigate('/dashboard')
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      const res = await fetch('https://social-hub-sqid.onrender.com/api/users/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })

      if (res.ok) {
        alert('OTP resent to your email')
      } else {
        const data = await res.json()
        setError(data.message)
      }
    } catch (err) {
      setError('Something went wrong')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Verify OTP</h2>
        <p className="info-text">Enter OTP sent to {email}</p>
        <form onSubmit={handleVerify}>
          <input 
            type="text" 
            placeholder="Enter 6-digit OTP" 
            value={otp} 
            onChange={(e) => setOtp(e.target.value)} 
            maxLength="6" 
            required 
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        <button onClick={handleResend} className="btn-secondary">
          Resend OTP
        </button>
      </div>
    </div>
  )
}