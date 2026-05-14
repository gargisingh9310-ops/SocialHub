import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import CreatePost from './CreatePost'
import PostCard from './PostCard'
import { Loader, AlertCircle } from 'lucide-react'
import '../stylesheet/Feed.css'

export default function Feed() {
  const user = useSelector(state => state.user)

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // ✅ ENV API URL
  const API = import.meta.env.VITE_API_URL

  useEffect(() => {
    if (user?.userId) {
      fetchFeed()
    }
  }, [user])

  // FEED
  const fetchFeed = async () => {
    try {
      const res = await fetch(`${API}/posts/feed/${user?.userId}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Failed to load feed')
        return
      }

      setPosts(data.posts || [])

    } catch (err) {
      setError('Failed to load feed')
    } finally {
      setLoading(false)
    }
  }

  // LIKE
  const handleLike = async (postId) => {
    try {
      const res = await fetch(`${API}/posts/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, userId: user?.userId })
      })

      if (res.ok) fetchFeed()

    } catch (err) {
      console.log('Error liking post')
    }
  }

  // COMMENT
  const handleComment = async (postId, text) => {
    try {
      const res = await fetch(`${API}/posts/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          userId: user?.userId,
          userName: user?.userName,
          text
        })
      })

      if (res.ok) fetchFeed()

    } catch (err) {
      console.log('Error adding comment')
    }
  }

  // DELETE
  const handleDelete = async (postId) => {
    try {
      const res = await fetch(`${API}/posts/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, userId: user?.userId })
      })

      if (res.ok) {
        setPosts(posts.filter(p => p._id !== postId))
      }

    } catch (err) {
      console.log('Error deleting post')
    }
  }

  return (
    <div className="feed">

      <CreatePost onPostCreate={fetchFeed} />

      {loading && (
        <div className="loading">
          <Loader size={20} className="spin" />
          <p>Loading feed...</p>
        </div>
      )}

      {error && (
        <div className="error">
          <AlertCircle size={18} />
          <p>{error}</p>
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div className="no-posts">
          <p>No posts yet. Start following friends!</p>
        </div>
      )}

      <div className="posts-list">
        {posts.map(post => (
          <PostCard
            key={post._id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
            onDelete={handleDelete}
          />
        ))}
      </div>

    </div>
  )
}