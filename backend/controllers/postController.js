import postModel from "../schemas/postSchema.js"
import userModel from "../schemas/userSchemas.js"
import notificationModel from "../schemas/notificationSchema.js"

// 🔥 CREATE POST
export const createPost = async (req, res) => {
  try {
    const { userId, userName, content, image, hashtags } = req.body

    if (!userId || !userName || !content) {
      return res.status(400).json({
        message: "userId, userName, and content required"
      })
    }

    const user = await userModel.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "user not found" })
    }

    const post = new postModel({
      userId,
      userName,
      userProfilePicture: user.profilePicture,
      content,
      image,
      hashtags: hashtags || []
    })

    await post.save()

    res.status(201).json({
      message: "post created",
      post
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "server error" })
  }
}

// 🔥 GET FEED
export const getFeed = async (req, res) => {
  try {
    const { userId } = req.params

    if (!userId) {
      return res.status(400).json({ message: "userId required" })
    }

    const user = await userModel.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "user not found" })
    }

    const friendIds = user.friends || []

    const posts = await postModel.find({
      $or: [
        { userId: userId },
        { userId: { $in: friendIds } }
      ]
    }).sort({ createdAt: -1 })

    res.status(200).json({ posts })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "server error" })
  }
}

// 🔥 LIKE / UNLIKE
export const likePost = async (req, res) => {
  try {
    const { postId, userId } = req.body

    const post = await postModel.findById(postId)
    if (!post) {
      return res.status(404).json({ message: "post not found" })
    }

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(id => id !== userId)
      await post.save()
      return res.status(200).json({ message: "post unliked" })
    }

    post.likes.push(userId)
    await post.save()

    const user = await userModel.findById(userId)

    await notificationModel.create({
      userId: post.userId,
      fromUserId: userId,
      fromUserName: user.userName,
      type: "like",
      postId,
      message: `${user.userName} liked your post`
    })

    res.status(200).json({ message: "post liked" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "server error" })
  }
}

// 🔥 COMMENT POST
export const commentPost = async (req, res) => {
  try {
    const { postId, userId, userName, text } = req.body

    if (!postId || !userId || !userName || !text) {
      return res.status(400).json({ message: "all fields required" })
    }

    const post = await postModel.findById(postId)
    if (!post) {
      return res.status(404).json({ message: "post not found" })
    }

    if (!post.comments) post.comments = []

    post.comments.push({
      userId,
      userName,
      text
    })

    await post.save()

    await notificationModel.create({
      userId: post.userId,
      fromUserId: userId,
      fromUserName: userName,
      type: "comment",
      postId,
      message: `${userName} commented on your post`
    })

    res.status(200).json({ message: "comment added" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "server error" })
  }
}

// 🔥 DELETE POST
export const deletePost = async (req, res) => {
  try {
    const { postId, userId } = req.body

    const post = await postModel.findById(postId)
    if (!post) {
      return res.status(404).json({ message: "post not found" })
    }

    if (post.userId !== userId) {
      return res.status(403).json({ message: "unauthorized" })
    }

    await postModel.findByIdAndDelete(postId)

    res.status(200).json({ message: "post deleted" })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "server error" })
  }
}

// 🔥 GET LIKES COUNT
export const getPostLikes = async (req, res) => {
  try {
    const { postId } = req.params

    const post = await postModel.findById(postId)
    if (!post) {
      return res.status(404).json({ message: "post not found" })
    }

    res.status(200).json({
      likes: post.likes.length
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "server error" })
  }
}