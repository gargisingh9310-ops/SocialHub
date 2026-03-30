import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import store from './redux/store'
import { Provider } from 'react-redux'

// Pages
import Register from './components/Register'
import VerifyOtp from './components/VerifyOtp'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import SearchFriends from './components/SearchFriends'
import FriendsList from './components/FriendsList'
import Feed from './components/Feed'
import Messages from './components/Messages'
import Notifications from './components/Notifications'

import './App.css'

// 🔒 Protected Route
function ProtectedRoute({ children }) {
  const isLoggedIn = useSelector(state => state.isLoggedIn)
  return isLoggedIn ? children : <Navigate to="/login" replace />
}

// 🔁 Public Route (login/register block when logged in)
function PublicRoute({ children }) {
  const isLoggedIn = useSelector(state => state.isLoggedIn)
  return !isLoggedIn ? children : <Navigate to="/dashboard" replace />
}

function AppRoutes() {
  const isLoggedIn = useSelector(state => state.isLoggedIn)

  return (
    <Routes>
      {/* Public */}
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/verify-otp" element={<PublicRoute><VerifyOtp /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

      {/* Protected */}
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
      <Route path="/search-friends" element={<ProtectedRoute><SearchFriends /></ProtectedRoute>} />
      <Route path="/friends-list" element={<ProtectedRoute><FriendsList /></ProtectedRoute>} />
      <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />

      {/* Default */}
      <Route path="/" element={<Navigate to={isLoggedIn ? '/dashboard' : '/register'} replace />} />
    </Routes>
  )
}

function AppContent() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  )
}