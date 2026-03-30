import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import '../stylesheet/Notifications.css'

export default function Notifications() {
  const user = useSelector(state => state.user)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
    fetchUnreadCount()
  }, [])

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`http://localhost:5000/notifications/${user?.userId}`)
      const data = await res.json()
      if (res.ok) {
        setNotifications(data.notifications)
      }
    } catch (err) {
      console.log('Error fetching notifications')
    } finally {
      setLoading(false)
    }
  }

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch(`http://localhost:5000/notifications/unread/${user?.userId}`)
      const data = await res.json()
      if (res.ok) {
        setUnreadCount(data.unreadCount)
      }
    } catch (err) {
      console.log('Error fetching unread count')
    }
  }

  const handleMarkAsRead = async (notificationId) => {
    try {
      const res = await fetch('http://localhost:5000/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId })
      })

      if (res.ok) {
        fetchNotifications()
        fetchUnreadCount()
      }
    } catch (err) {
      console.log('Error marking as read')
    }
  }

  const handleDelete = async (notificationId) => {
    try {
      const res = await fetch('http://localhost:5000/notifications/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId })
      })

      if (res.ok) {
        setNotifications(notifications.filter(n => n._id !== notificationId))
      }
    } catch (err) {
      console.log('Error deleting notification')
    }
  }

  const getNotificationIcon = (type) => {
    const icons = {
      like: '❤️',
      comment: '💬',
      follow: '👤',
      message: '💌'
    }
    return icons[type] || '📢'
  }

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h2>Notifications</h2>
        {unreadCount > 0 && (
          <span className="unread-badge">{unreadCount}</span>
        )}
      </div>

      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <div className="no-notifications">
          <p>No notifications yet</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div
              key={notification._id}
              className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
            >
              <div className="notification-content">
                <span className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </span>
                <div className="notification-text">
                  <p className="notification-message">{notification.message}</p>
                  <small>
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>

              <div className="notification-actions">
                {!notification.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(notification._id)}
                    className="mark-read-btn"
                  >
                    ✓
                  </button>
                )}
                <button
                  onClick={() => handleDelete(notification._id)}
                  className="delete-btn"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}