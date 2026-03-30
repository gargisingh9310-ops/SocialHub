import { useNavigate } from 'react-router-dom'
import {
  Home,
  Search,
  Users,
  User,
  Newspaper,
  MessageCircle,
  Bell,
  Settings
} from 'lucide-react'
import '../stylesheet/Sidebar.css'

export default function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside className="sidebar">
      <div className="sidebar-menu">

        <div className="sidebar-item" onClick={() => navigate('/dashboard')}>
          <Home size={18} />
          <span>Home</span>
        </div>

        <div className="sidebar-item" onClick={() => navigate('/search-friends')}>
          <Search size={18} />
          <span>Search</span>
        </div>

        <div className="sidebar-item" onClick={() => navigate('/friends-list')}>
          <Users size={18} />
          <span>Friends</span>
        </div>

        <div className="sidebar-item" onClick={() => navigate('/profile')}>
          <User size={18} />
          <span>Profile</span>
        </div>

        <div className="sidebar-item" onClick={() => navigate('/feed')}>
          <Newspaper size={18} />
          <span>Feed</span>
        </div>

        <div className="sidebar-item" onClick={() => navigate('/messages')}>
          <MessageCircle size={18} />
          <span>Messages</span>
        </div>

        <div className="sidebar-item" onClick={() => navigate('/notifications')}>
          <Bell size={18} />
          <span>Notifications</span>
        </div>

        <div className="sidebar-item" onClick={() => navigate('/edit-profile')}>
          <Settings size={18} />
          <span>Settings</span>
        </div>

      </div>
    </aside>
  )
}