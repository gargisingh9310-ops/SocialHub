import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Edit, ArrowLeft } from 'lucide-react'
import '../stylesheet/Profile.css'

export default function Profile() {

  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ✅ ENV API URL
  const API = import.meta.env.VITE_API_URL

  useEffect(() => {
    if (user?.userId) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API}/users/profile/${user?.userId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Failed to load profile')
        return
      }

      setProfile(data || null)

    } catch (err) {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  // LOADING UI
  if (loading) {
    return (
      <div className="profile-container">
        <p>Loading...</p>
      </div>
    )
  }

  // ERROR UI
  if (error) {
    return (
      <div className="profile-container">
        <p className="error">{error}</p>
      </div>
    )
  }

  return (
    <div className="profile-container">

      <div className="profile-box">

        {/* HEADER */}
        <div className="profile-header">

          <h2>My Profile</h2>

          <button
            onClick={() => navigate('/edit-profile')}
            className="edit-btn"
          >
            <Edit size={16} />
            Edit
          </button>

        </div>

        {/* AVATAR */}
        <div className="profile-avatar">

          {profile?.profilePicture ? (
            <img src={profile.profilePicture} alt="profile" />
          ) : (
            <div className="avatar-placeholder">
              {profile?.firstName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}

        </div>

        {/* INFO */}
        <div className="profile-info">

          <div className="info-card">
            <User size={16} />
            <div>
              <span>Name</span>
              <p>{profile?.firstName} {profile?.lastName}</p>
            </div>
          </div>

          <div className="info-card">
            <User size={16} />
            <div>
              <span>Username</span>
              <p>@{profile?.userName}</p>
            </div>
          </div>

          <div className="info-card">
            <Mail size={16} />
            <div>
              <span>Email</span>
              <p>{profile?.email}</p>
            </div>
          </div>

          <div className="info-card">
            <User size={16} />
            <div>
              <span>Bio</span>
              <p>{profile?.bio || 'No bio yet'}</p>
            </div>
          </div>

        </div>

        {/* BACK */}
        <button
          onClick={() => navigate('/dashboard')}
          className="back-btn"
        >
          <ArrowLeft size={16} />
          Back
        </button>

      </div>

    </div>
  )
}