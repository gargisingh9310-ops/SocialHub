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

  useEffect(() => {
    fetchFriends()
  }, [])

  const fetchFriends = async () => {
    try {
      const res = await fetch(`http://localhost:5000/users/friends/${user?.userId}`)
      const data = await res.json()

      if (res.ok) {
        setFriends(data.friends)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Failed to load friends')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveFriend = async (friendId) => {
    try {
      const res = await fetch('http://localhost:5000/users/remove-friend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.userId, friendId })
      })

      if (res.ok) {
        setFriends(friends.filter(f => f._id !== friendId))
        alert('Friend removed!')
      } else {
        alert('Error removing friend')
      }
    } catch (err) {
      alert('Error removing friend')
    }
  }

  if (loading) {
    return <div className="friends-container"><p>Loading...</p></div>
  }

  return (
    <div className="friends-container">
      <div className="friends-box">
        <div className="friends-header">
          <h2>My Friends ({friends.length})</h2>
          <button onClick={() => navigate('/search-friends')} className="search-btn">
            Search Friends
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {friends.length === 0 ? (
          <div className="no-friends">
            <p>You have no friends yet</p>
            <button onClick={() => navigate('/search-friends')} className="btn-add-first">
              Add Your First Friend
            </button>
          </div>
        ) : (
          <div className="friends-grid">
            {friends.map((friend) => (
              <div key={friend._id} className="friend-card">
                <div className="friend-avatar">
                  {friend.profilePicture ? (
                    <img src={friend.profilePicture} alt={friend.userName} />
                  ) : (
                    <div className="avatar-placeholder">
                      {friend.firstName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="friend-info">
                  <h3>{friend.firstName} {friend.lastName}</h3>
                  <p>@{friend.userName}</p>
                </div>

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

        <button onClick={() => navigate('/dashboard')} className="back-btn">
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}