import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import axios from 'axios'

import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Users, Star, MessageCircle, PenSquare, Search, User } from 'lucide-react'

import '../stylesheet/Dashboard.css'

export default function Dashboard() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector(state => state.user)
  const stats = useSelector(state => state.stats)

  // ✅ ENV API URL
  const API = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${API}/api/dashboard/stats/${user._id}`
        )

        dispatch({
          type: "SET_STATS",
          payload: {
            friends: res.data.data.friendsCount,
            views: res.data.data.profileViews,
            messages: res.data.data.messagesCount
          }
        })

      } catch (err) {
        console.log("Stats error:", err)
      }
    }

    if (user?._id) fetchStats()
  }, [user, dispatch, API])

  return (
    <div className="dashboard-layout">
      <Navbar />

      <div className="dashboard-main">
        <Sidebar />

        <main className="dashboard-content">

          {/* Welcome */}
          <div className="welcome-section">
            <div className="welcome-card">

              <div className="welcome-header">
                <h2>Welcome back, {user?.userName}!</h2>
                <p>You are logged in successfully</p>
              </div>

              {/* Stats */}
              <div className="stats-grid">

                <div className="stat-card">
                  <Users size={22} />
                  <div className="stat-info">
                    <p className="stat-label">Friends</p>
                    <p className="stat-value">{stats?.friends || 0}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <Star size={22} />
                  <div className="stat-info">
                    <p className="stat-label">Profile Views</p>
                    <p className="stat-value">{stats?.views || 0}</p>
                  </div>
                </div>

                <div className="stat-card">
                  <MessageCircle size={22} />
                  <div className="stat-info">
                    <p className="stat-label">Messages</p>
                    <p className="stat-value">{stats?.messages || 0}</p>
                  </div>
                </div>

              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <h3>Quick Actions</h3>

                <div className="action-buttons">

                  <button
                    className="action-btn"
                    onClick={() => navigate('/feed')}
                  >
                    <PenSquare size={18} /> Create Post
                  </button>

                  <button
                    className="action-btn"
                    onClick={() => navigate('/search-friends')}
                  >
                    <Search size={18} /> Find Friends
                  </button>

                  <button
                    className="action-btn"
                    onClick={() => navigate('/edit-profile')}
                  >
                    <User size={18} /> Edit Profile
                  </button>

                </div>
              </div>

            </div>
          </div>

        </main>
      </div>
    </div>
  )
}