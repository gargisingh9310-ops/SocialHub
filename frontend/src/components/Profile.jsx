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

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const res = await fetch(`https://socialhub-rdc3.onrender.com/users/profile/${user?.userId}`)
      const data = await res.json()

      if (res.ok) setProfile(data)
      else setError(data.message)
    } catch {
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="profile-container"><p>Loading...</p></div>
  }

  if (error) {
    return <div className="profile-container"><p className="error">{error}</p></div>
  }

  return (
    <div className="profile-container">
      <div className="profile-box">

        {/* HEADER */}
        <div className="profile-header">
          <h2>My Profile</h2>
          <button onClick={() => navigate('/edit-profile')} className="edit-btn">
            <Edit size={16}/> Edit
          </button>
        </div>

        {/* AVATAR */}
        <div className="profile-avatar">
          {profile?.profilePicture ? (
            <img src={profile.profilePicture} />
          ) : (
            <div className="avatar-placeholder">
              {profile?.firstName?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="profile-info">

          <div className="info-card">
            <User size={16}/>
            <div>
              <span>Name</span>
              <p>{profile?.firstName} {profile?.lastName}</p>
            </div>
          </div>

          <div className="info-card">
            <User size={16}/>
            <div>
              <span>Username</span>
              <p>@{profile?.userName}</p>
            </div>
          </div>

          <div className="info-card">
            <Mail size={16}/>
            <div>
              <span>Email</span>
              <p>{profile?.email}</p>
            </div>
          </div>

          <div className="info-card">
            <User size={16}/>
            <div>
              <span>Bio</span>
              <p>{profile?.bio || 'No bio yet'}</p>
            </div>
          </div>

        </div>

        {/* BUTTON */}
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          <ArrowLeft size={16}/> Back
        </button>

      </div>
    </div>
  )
}