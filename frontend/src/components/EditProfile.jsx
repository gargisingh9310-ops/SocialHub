import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Upload, User } from 'lucide-react'
import '../stylesheet/Profile.css'

export default function EditProfile() {
  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  const [bio, setBio] = useState(user?.bio || '')
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // ✅ ENV API URL
  const API = import.meta.env.VITE_API_URL

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePicture(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch(`${API}/users/update-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.userId,
          bio,
          profilePicture
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Update failed')
        return
      }

      setSuccess('Profile updated successfully!')

      setTimeout(() => navigate('/profile'), 1500)

    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-box">
        <h2>Edit Profile</h2>

        <form onSubmit={handleSubmit}>

          {/* PROFILE IMAGE */}
          <div className="profile-picture-section">

            <div className="profile-picture-preview">
              {profilePicture ? (
                <img src={profilePicture} alt="Profile" />
              ) : (
                <div className="placeholder">
                  <User size={30} />
                </div>
              )}
            </div>

            <label className="upload-btn">
              <Upload size={16} /> Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                hidden
              />
            </label>

            <p className="file-info">JPG, PNG max 2MB</p>
          </div>

          {/* BIO */}
          <div className="form-group">
            <label>Bio</label>
            <textarea
              placeholder="Tell us about yourself"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength="500"
              rows="4"
            />
            <p className="char-count">{bio.length}/500</p>
          </div>

          {/* ERROR / SUCCESS */}
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          {/* BUTTONS */}
          <div className="button-group">
            <button type="submit" disabled={loading} className="btn">
              {loading ? 'Saving...' : 'Save Profile'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="btn-cancel"
            >
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}