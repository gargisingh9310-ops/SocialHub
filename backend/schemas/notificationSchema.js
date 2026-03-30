import { model, Schema } from "mongoose"

const notificationSchema = new Schema({
  userId: {
    type: String,
    required: true
  },
  fromUserId: {
    type: String,
    required: true
  },
  fromUserName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['like', 'comment', 'follow', 'message'],
    required: true
  },
  postId: {
    type: String,
    default: null
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const notificationModel = model("Notifications", notificationSchema)
export default notificationModel