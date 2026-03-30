import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../redux/authActions'
import { Globe, LogOut } from 'lucide-react'
import '../stylesheet/Navbar.css'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.user)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <div className="navbar-logo">
          <Globe size={20} />
          <h1>SocialHub</h1>
        </div>

        <div className="navbar-user">
          <span className="user-name">{user?.userName}</span>

          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
          </button>
        </div>

      </div>
    </nav>
  )
}