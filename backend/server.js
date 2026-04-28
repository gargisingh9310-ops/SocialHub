import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";

import connectToDb from "./config/db.config.js";
import userRouter from "./routers/userRouter.js";
import postRouter from "./routers/postRouter.js";
import messageRouter from "./routers/messageRouter.js";
import notificationRouter from "./routers/notificationRouter.js";
import { verifyTransport } from "./services/otpservice.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);


// ALLOWED ORIGINS
const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:5173",
  "https://social-hub-sqid.onrender.com"
];

//  DEBUG (optional)
app.use((req, res, next) => {
  console.log("Incoming Origin:", req.headers.origin);
  next();
});

//  CORS (FINAL FIX)
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS blocked: " + origin));
      }
    },
    credentials: true
  })
);

//  SOCKET.IO
const io = new Server(httpServer, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Socket CORS blocked: " + origin));
      }
    },
    credentials: true
  }
});

//  SOCKET LOGIC
const onlineUsers = new Map();

io.on("connection", (socket) => {
  socket.on("user_connected", (userId) => {
    onlineUsers.set(userId, socket.id);
    io.emit("online_users", Array.from(onlineUsers.keys()));
  });

  socket.on("send_message", (data) => {
    const { senderId, receiverId, message } = data;
    const receiverSocketId = onlineUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_message", {
        senderId,
        message,
        timestamp: new Date()
      });
    }
  });

  socket.on("typing", (data) => {
    const { receiverId, senderName } = data;
    const receiverSocketId = onlineUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("user_typing", { senderName });
    }
  });

  socket.on("stop_typing", (data) => {
    const { receiverId } = data;
    const receiverSocketId = onlineUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("user_stop_typing");
    }
  });

  socket.on("disconnect", () => {
    let disconnectedUserId;

    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        onlineUsers.delete(userId);
        break;
      }
    }

    if (disconnectedUserId) {
      io.emit("online_users", Array.from(onlineUsers.keys()));
    }
  });
});

//  MIDDLEWARE
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

//  ROOT ROUTE
app.get("/", (req, res) => {
  res.send("🚀 Social Hub API is running");
});

//  ROUTES
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/messages", messageRouter);
app.use("/notifications", notificationRouter);

//  GLOBALS
app.set("io", io);

//  INIT
verifyTransport();
connectToDb();

//  START SERVER
const PORT = process.env.PORT || 4000;

httpServer.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
});