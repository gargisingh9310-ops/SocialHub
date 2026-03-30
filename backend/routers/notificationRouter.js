import { Router } from "express"
import { getNotifications, markAsRead, deleteNotification, getUnreadCount } from "../controllers/norificationController.js"

const notificationRouter = Router()

notificationRouter.get("/:userId", getNotifications)
notificationRouter.post("/mark-read", markAsRead)
notificationRouter.post("/delete", deleteNotification)
notificationRouter.get("/unread/:userId", getUnreadCount)

export default notificationRouter