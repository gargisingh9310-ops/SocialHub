import messageModel from "../schemas/messageSchema.js"
import notificationModel from "../schemas/notificationSchema.js"

export async function sendMessage(req, res) {
  try {
    const { senderId, senderName, receiverId, receiverName, message } = req.body

    if (!senderId || !senderName || !receiverId || !receiverName || !message) {
      return res.status(400).json({
        message: "all fields required"
      })
    }

    const newMessage = new messageModel({
      senderId,
      senderName,
      receiverId,
      receiverName,
      message
    })

    await newMessage.save()

    await notificationModel.create({
      userId: receiverId,
      fromUserId: senderId,
      fromUserName: senderName,
      type: 'message',
      message: `${senderName} sent you a message`
    })

    return res.status(201).json({
      message: "message sent",
      success: true
    })
  } catch (error) {
    console.error("Send message error:", error)
    return res.status(500).json({
      message: error.message || "something went wrong",
      success: false
    })
  }
}

export async function getMessages(req, res) {
  try {
    const { userId, otherUserId } = req.params

    const messages = await messageModel.find({
      $or: [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId }
      ]
    }).sort({ createdAt: 1 })

    return res.status(200).json({
      messages
    })
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong"
    })
  }
}

export async function getConversations(req, res) {
  try {
    const { userId } = req.params

    const messages = await messageModel.find({
      $or: [
        { senderId: userId },
        { receiverId: userId }
      ]
    }).sort({ createdAt: -1 })

    const conversations = {}
    messages.forEach(msg => {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId
      const otherUserName = msg.senderId === userId ? msg.receiverName : msg.senderName
      
      if (!conversations[otherUserId]) {
        conversations[otherUserId] = {
          userId: otherUserId,
          userName: otherUserName,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt
        }
      }
    })

    return res.status(200).json({
      conversations: Object.values(conversations)
    })
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong"
    })
  }
}

export async function deleteMessage(req, res) {
  try {
    const { messageId, userId } = req.body

    const message = await messageModel.findById(messageId)
    if (!message) {
      return res.status(404).json({
        message: "message not found"
      })
    }

    if (message.senderId !== userId) {
      return res.status(403).json({
        message: "unauthorized"
      })
    }

    await messageModel.findByIdAndDelete(messageId)

    return res.status(200).json({
      message: "message deleted"
    })
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong"
    })
  }
}