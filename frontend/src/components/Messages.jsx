import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import io from 'socket.io-client'
import { Send, MessageCircle, Users } from 'lucide-react'
import '../stylesheet/Message.css'

let socket

export default function Messages() {
  const user = useSelector(state => state.user)

  const [conversations, setConversations] = useState([])
  const [friends, setFriends] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageText, setMessageText] = useState('')
  const [loading, setLoading] = useState(true)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [isTyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState('conversations')

  const messagesEndRef = useRef(null)

  useEffect(() => {
    socket = io('https://social-hub-sqid.onrender.com/api')
    socket.emit('user_connected', user?.userId)

    socket.on('online_users', setOnlineUsers)

    socket.on('receive_message', (data) => {
      if (selectedUser && data.senderId === selectedUser.userId) {
        setMessages(prev => [...prev, data])
      }
      fetchConversations()
    })

    socket.on('user_typing', () => setIsTyping(true))
    socket.on('user_stop_typing', () => setIsTyping(false))

    fetchConversations()
    fetchFriends()
    setLoading(false)

    return () => socket.disconnect()
  }, [user?.userId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchConversations = async () => {
    const res = await fetch(`https://social-hub-sqid.onrender.com/api/messages/conversations/${user?.userId}`)
    const data = await res.json()
    if (res.ok) setConversations(data.conversations)
  }

  const fetchFriends = async () => {
    const res = await fetch(`https://social-hub-sqid.onrender.com/api/users/friends/${user?.userId}`)
    const data = await res.json()
    if (res.ok) setFriends(data.friends || [])
  }

  const fetchMessages = async (id) => {
    const res = await fetch(`https://social-hub-sqid.onrender.com/api/messages/chat/${user?.userId}/${id}`)
    const data = await res.json()
    if (res.ok) setMessages(data.messages)
  }

  const handleSelectUser = (u) => {
    setSelectedUser(u)
    fetchMessages(u._id || u.userId)
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedUser) return

    const id = selectedUser._id || selectedUser.userId

    socket.emit('send_message', {
      senderId: user?.userId,
      receiverId: id,
      message: messageText
    })

    await fetch('https://social-hub-sqid.onrender.com/api/messages/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        senderId: user?.userId,
        senderName: user?.userName,
        receiverId: id,
        receiverName: selectedUser.userName,
        message: messageText
      })
    })

    setMessages(prev => [...prev, {
      senderId: user?.userId,
      message: messageText,
      createdAt: new Date()
    }])

    setMessageText('')
  }

  const isOnline = onlineUsers.includes(selectedUser?._id || selectedUser?.userId)

  return (
    <div className="messages-container">

      {/* LEFT */}
      <div className="sidebar-chat">

        <div className="chat-tabs">
          <button
            className={activeTab === 'conversations' ? 'active' : ''}
            onClick={() => setActiveTab('conversations')}
          >
            <MessageCircle size={16}/> Chats
          </button>

          <button
            className={activeTab === 'friends' ? 'active' : ''}
            onClick={() => setActiveTab('friends')}
          >
            <Users size={16}/> Friends
          </button>
        </div>

        {(activeTab === 'conversations' ? conversations : friends).map(item => {
          const id = item.userId || item._id
          const online = onlineUsers.includes(id)

          return (
            <div
              key={id}
              className={`chat-user ${selectedUser?.userId === id ? 'active' : ''}`}
              onClick={() => handleSelectUser(item)}
            >
              <div className="avatar-small">
                {item.userName?.charAt(0).toUpperCase()}
              </div>

              <div className="chat-user-info">
                <p>{item.userName}</p>
                <span className={online ? 'online' : 'offline'} />
              </div>
            </div>
          )
        })}
      </div>

      {/* RIGHT */}
      <div className="chat-area">
        {!selectedUser ? (
          <div className="no-chat">
            <MessageCircle size={40}/>
            <p>Select a chat to start messaging</p>
          </div>
        ) : (
          <>
            <div className="chat-header">
              <h3>{selectedUser.userName}</h3>
              <span className={isOnline ? 'online' : 'offline'} />
            </div>

            <div className="messages-list">
              {messages.map((msg, i) => (
                <div key={i} className={`msg ${msg.senderId === user?.userId ? 'sent' : 'received'}`}>
                  {msg.message}
                </div>
              ))}

              {isTyping && <div className="typing">typing...</div>}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input">
              <input
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type message..."
              />

              <button onClick={handleSendMessage}>
                <Send size={18}/>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}