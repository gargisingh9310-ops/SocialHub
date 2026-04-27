 import e from "express"
  import cors from "cors"
  import dotenv from "dotenv"
  import { createServer } from "http"
  import { Server } from "socket.io"
  import connectToDb from "./config/db.config.js"
  import userRouter from "./routers/userRouter.js"
  import postRouter from "./routers/postRouter.js"
  import messageRouter from "./routers/messageRouter.js"
  import notificationRouter from "./routers/notificationRouter.js"
  import cookieParser from "cookie-parser"
  import { verifyTransport } from "./services/otpservice.js"

  dotenv.config()

  const app = e()
  const httpServer = createServer(app)
  const io = new Server(httpServer, {
    cors: {
      origin: 'https://https://social-hub-sqid.onrender.com',
      credentials: true
    }
  })
 
  const onlineUsers = new Map()

  io.on('connection', (socket) => {
    socket.on('user_connected', (userId) => {
      onlineUsers.set(userId, socket.id)
      io.emit('online_users', Array.from(onlineUsers.keys()))
    })

    socket.on('send_message', (data) => {
      const { senderId, receiverId, message } = data
      const receiverSocketId = onlineUsers.get(receiverId)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', {
          senderId,
          message,
          timestamp: new Date()
        })
      }
    })

    socket.on('typing', (data) => {
      const { receiverId, senderName } = data
      const receiverSocketId = onlineUsers.get(receiverId)
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('user_typing', { senderName })
      }
    })

    socket.on('stop_typing', (data) => {
      const { receiverId } = data
      const receiverSocketId = onlineUsers.get(receiverId)
      if (receiverSocketId) { 
        io.to(receiverSocketId).emit('user_stop_typing')
      } 
    })

    socket.on('disconnect', () => {
      let disconnectedUserId
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          disconnectedUserId = userId
          onlineUsers.delete(userId)
          break
        }
      }
      if (disconnectedUserId) {
        io.emit('online_users', Array.from(onlineUsers.keys()))
      }
    })
  })

  app.use(cors({
    origin: 'https://https://social-hub-sqid.onrender.com',
    credentials: true
  }))
  app.use(cookieParser())
  app.use(e.json({ limit: '50mb' }))
  app.use(e.urlencoded({ limit: '50mb', extended: true }))
  app.use("/users", userRouter)
  app.use("/posts", postRouter)
  app.use("/messages", messageRouter)
  app.use("/notifications", notificationRouter)

  app.set('io', io)
 
  verifyTransport()
  connectToDb()

  httpServer.listen(process.env.PORT, () => {
      console.log(`✓ Server running on port ${process.env.PORT}`)
  }) 