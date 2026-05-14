import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import '../stylesheet/Friends.css'

export default function FriendsList() {

  const user = useSelector(state => state.user)
  const navigate = useNavigate()

  const [friends, setFriends] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ✅ ENV API URL
  const API = import.meta.env.VITE_API_URL

  useEffect(() => {
    if (user?.userId) {
      fetchFriends()
    }
  }, [user])

  // GET FRIENDS
  const fetchFriends = async () => {
    try {
      const res = await fetch(`${API}/users/friends/${user?.userId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Failed to load friends')
        return
      }

      setFriends(data.friends || [])

    } catch (err) {
      setError('Failed to load friends')
    } finally {
      setLoading(false)
    }
  }

  // REMOVE FRIEND
  const handleRemoveFriend = async (friendId) => {
    try {
      const res = await fetch(`${API}/users/remove-friend`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user?.userId,
          friendId
        })
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || 'Error removing friend')
        return
      }

      setFriends(prev =>
        prev.filter(friend => friend._id !== friendId)
      )

      alert('Friend removed successfully')

    } catch (err) {
      alert('Error removing friend')
    }
  }

  // LOADING UI
  if (loading) {
    return (
      <div className="friends-container">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="friends-container">

      <div className="friends-box">

        {/* HEADER */}
        <div className="friends-header">

          <h2>
            My Friends ({friends.length})
          </h2>

          <button
            onClick={() => navigate('/search-friends')}
            className="search-btn"
          >
            Search Friends
          </button>

        </div>

        {/* ERROR */}
        {error && (
          <p className="error">{error}</p>
        )}

        {/* NO FRIENDS */}
        {friends.length === 0 ? (

          <div className="no-friends">

            <p>You have no friends yet</p>

            <button
              onClick={() => navigate('/search-friends')}
              className="btn-add-first"
            >
              Add Your First Friend
            </button>

          </div>

        ) : (

          <div className="friends-grid">

            {friends.map((friend) => (

              <div key={friend._id} className="friend-card">

                {/* AVATAR */}
                <div className="friend-avatar">

                  {friend.profilePicture ? (
                    <img
                      src={friend.profilePicture}
                      alt={friend.userName}
                    />
                  ) : (
                    <div className="avatar-placeholder">
                      {friend.firstName?.charAt(0).toUpperCase()}
                    </div>
                  )}

                </div>

                {/* INFO */}
                <div className="friend-info">

                  <h3>
                    {friend.firstName} {friend.lastName}
                  </h3>

                  <p>@{friend.userName}</p>

                </div>

                {/* REMOVE */}
                <button
                  onClick={() => handleRemoveFriend(friend._id)}
                  className="btn-remove"
                >
                  Remove
                </button>

              </div>

            ))}

          </div>

        )}

        {/* BACK */}
        <button
          onClick={() => navigate('/dashboard')}
          className="back-btn"
        >
          Back to Dashboard
        </button>

      </div>

    </div>
  )
}