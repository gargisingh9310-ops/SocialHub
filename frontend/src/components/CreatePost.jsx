import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Image, Smile, MapPin, X } from 'lucide-react'
import EmojiPicker from 'emoji-picker-react'
import '../stylesheet/CreatePost.css'

export default function CreatePost({ onPostCreate }) {
  const user = useSelector(state => state.user)

  const [content, setContent] = useState('')
  const [image, setImage] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [location, setLocation] = useState('')
  const [showEmoji, setShowEmoji] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // IMAGE
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImage(reader.result)
      reader.readAsDataURL(file)
    }
  }

  // EMOJI
  const handleEmojiClick = (emojiData) => {
    setContent(prev => prev + emojiData.emoji)
  }

  // POST
  const handleCreatePost = async () => {
    if (!content.trim()) {
      setError('Content cannot be empty')
      return
    }

    setLoading(true)
    setError('')

    try {
      const tagsArray = hashtags
        .split(',')
        .map(tag => tag.trim().replace('#', ''))
        .filter(tag => tag)

      const res = await fetch('http://localhost:5000/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.userId,
          userName: user?.userName,
          content,
          image,
          hashtags: tagsArray,
          location
        })
      })

      if (res.ok) {
        setContent('')
        setImage('')
        setHashtags('')
        setLocation('')
        setShowEmoji(false)
        onPostCreate()
      } else {
        setError('Failed to create post')
      }
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-post">

      {/* HEADER */}
      <div className="create-post-header">
        <div className="create-post-avatar">
          {user?.userName?.charAt(0).toUpperCase()}
        </div>
        <p>What's on your mind, {user?.userName}?</p>
      </div>

      {/* TEXT */}
      <textarea
        placeholder="Share your thoughts..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="create-post-input"
      />

      {/* IMAGE PREVIEW */}
      {image && (
        <div className="image-preview">
          <img src={image} />
          <button onClick={() => setImage('')}>
            <X size={16} color='#fff'/>
          </button>
        </div>
      )}

      {/* LOCATION INPUT */}
      {location && (
        <div className="location-preview">
          <MapPin size={14} color='#fff'/> {location}
        </div>
      )}

      {/* HASHTAGS */}
      <input
        type="text"
        placeholder="#tags, comma separated"
        value={hashtags}
        onChange={(e) => setHashtags(e.target.value)}
        className="hashtags-input"
      />

      {/* EMOJI PICKER */}
      {showEmoji && (
        <div className="emoji-box">
          <EmojiPicker onEmojiClick={handleEmojiClick}/>
        </div>
      )}

      {/* FOOTER */}
      <div className="create-post-footer">

        <div className="post-tools">

          <label className="tool-btn">
            <Image size={18} color='#fff'/>
            <input type="file" hidden onChange={handleImageUpload}/>
          </label>

          <button 
            className="tool-btn"
            onClick={() => setShowEmoji(!showEmoji)}
          >
            <Smile size={18} color='#fff'/>
          </button>

          <button 
            className="tool-btn"
            onClick={() => {
              const loc = prompt('Enter location')
              if (loc) setLocation(loc)
            }}
          >
            <MapPin size={18} color='#fff'/>
          </button>

        </div>

        {error && <p className="error">{error}</p>}

        <button onClick={handleCreatePost} className="post-btn">
          {loading ? 'Posting...' : 'Post'}
        </button>

      </div>
    </div>
  )
}