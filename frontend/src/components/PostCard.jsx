import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Heart, MessageCircle, Share2, Trash2, Send } from 'lucide-react'
import '../stylesheet/PostCard.css'

export default function PostCard({ post, onLike, onComment, onDelete }) {
  const user = useSelector(state => state.user)

  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')

  const isLiked = post.likes?.includes(user?.userId)

  const handleAddComment = async () => {
    if (!commentText.trim()) return
    await onComment(post._id, commentText)
    setCommentText('')
  }

  return (
    <div className="post-card">

      {/* HEADER */}
      <div className="post-header">
        <div className="user-info">
          <div className="avatar">
            {post.userProfilePicture ? (
              <img src={post.userProfilePicture} />
            ) : (
              <div className="avatar-placeholder">
                {post.userName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <p className="username">{post.userName}</p>
            <span className="time">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {post.userId === user?.userId && (
          <button className="delete-btn" onClick={() => onDelete(post._id)}>
            <Trash2 size={16}/>
          </button>
        )}
      </div>

      {/* CONTENT */}
      <div className="post-content">
        <p>{post.content}</p>

        {post.image && (
          <img src={post.image} className="post-img" />
        )}

        {post.hashtags?.length > 0 && (
          <div className="hashtags">
            {post.hashtags.map((tag, i) => (
              <span key={i}>#{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* STATS */}
      <div className="post-stats">
        <span>{post.likes?.length || 0} likes</span>
        <span>{post.comments?.length || 0} comments</span>
      </div>

      {/* ACTIONS */}
      <div className="post-actions">

        <button
          className={`action ${isLiked ? 'liked' : ''}`}
          onClick={() => onLike(post._id)}
        >
          <Heart size={18} /> 
        </button>

        <button
          className="action"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle size={18} />
        </button>

        <button className="action">
          <Share2 size={18} />
        </button>

      </div>

      {/* COMMENTS */}
      {showComments && (
        <div className="comments">

          <div className="comment-list">
            {post.comments?.map((c, i) => (
              <div key={i} className="comment">
                <strong>{c.userName}</strong>
                <p>{c.text}</p>
              </div>
            ))}
          </div>

          <div className="comment-input">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <button onClick={handleAddComment}>
              <Send size={16}/>
            </button>
          </div>

        </div>
      )}
    </div>
  )
}