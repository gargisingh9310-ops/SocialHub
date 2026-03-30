import { Router } from "express"
import { sendMessage, getMessages, getConversations, deleteMessage } from "../controllers/messageController.js"

const messageRouter = Router()

messageRouter.post("/send", sendMessage)
messageRouter.get("/chat/:userId/:otherUserId", getMessages)
messageRouter.get("/conversations/:userId", getConversations)
messageRouter.post("/delete", deleteMessage)

export default messageRouter