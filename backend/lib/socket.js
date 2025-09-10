import { Server } from "socket.io"
import http from "http"
import express from "express"

const app = express()
const server = http.createServer(app)

// ✅ Use env var for flexibility
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",   // local dev frontend
      process.env.FRONTEND_URL   // deployed frontend domain
    ],
    credentials: true,
  },
})

const socketOnline = {}

export function getReciver(userId) {
  return socketOnline[userId]
}

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id)

  const userId = socket.handshake.auth.userId

  if (userId) {
    socketOnline[userId] = socket.id
  }

  io.emit("getOnline", Object.keys(socketOnline))

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id)
    delete socketOnline[userId]
    io.emit("getOnline", Object.keys(socketOnline))
  })
})

export { io, app, server }
