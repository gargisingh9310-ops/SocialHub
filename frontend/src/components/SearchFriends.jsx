import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Search, UserPlus, UserMinus } from 'lucide-react'
import '../stylesheet/SearchFriend.css'

export default function SearchFriends() {
  const user = useSelector(state => state.user)
  const [search, setSearch] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [friends, setFriends] = useState([])

  useEffect(() => {
    fetchFriends()
  }, [])

  const fetchFriends = async () => {
    try {
      const res = await fetch(`https://socialhub-backend-8c96.onrender.com/users/friends/${user?.userId}`)
      const data = await res.json()
      if (res.ok) {
        setFriends(data.friends.map(f => f._id))
      }
    } catch (err) {
      console.log('Error fetching friends')
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`https://socialhub-backend-8c96.onrender.com/users/search-friends?query=${search}&userId=${user?.userId}`)
      const data = await res.json()

      if (res.ok) {
        setResults(data.users)
      } else {
        setError(data.message)
      }
    } catch (err) {
      setError('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleAddFriend = async (friendId) => {
    try {
      const res = await fetch('https://socialhub-backend-8c96.onrender.com/users/add-friend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.userId, friendId })
      })

      if (res.ok) {
        setFriends([...friends, friendId])
      }
    } catch (err) {
      alert('Error adding friend')
    }
  }

  const handleRemoveFriend = async (friendId) => {
    try {
      const res = await fetch('https://socialhub-backend-8c96.onrender.com/users/remove-friend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.userId, friendId })
      })

      if (res.ok) {
        setFriends(friends.filter(id => id !== friendId))
      }
    } catch (err) {
      alert('Error removing friend')
    }
  }

  return (
    <div className="search-friends-container">
      <div className="search-friends-box">
        <h2>Find Friends</h2>

        <form onSubmit={handleSearch} className="search-bar">
          <Search size={18} className="search-icon" />
          
          <input
            className="search-input"
            type="text"
            placeholder="Search username or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <p className="error">{error}</p>}

        <div className="results">
          {results.length === 0 && search && !loading && (
            <p className="no-results">No users found</p>
          )}

          {results.map((result) => (
            <div key={result._id} className="result-card">
              
              <div className="result-avatar">
                {result.profilePicture ? (
                  <img src={result.profilePicture} alt={result.userName} />
                ) : (
                  <div className="avatar-placeholder">
                    {result.firstName?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="result-info">
                <h3>{result.firstName} {result.lastName}</h3>
                <p>@{result.userName}</p>
                <span>{result.email}</span>
              </div>

              <div className="result-action">
                {friends.includes(result._id) ? (
                  <button
                    onClick={() => handleRemoveFriend(result._id)}
                    className="btn-remove"
                  >
                    <UserMinus size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => handleAddFriend(result._id)}
                    className="btn-add"
                  >
                    <UserPlus size={16} />
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}