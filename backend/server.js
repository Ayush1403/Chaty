import express from 'express'
import dotenv from 'dotenv'
import { database } from './lib/db.js'
import userRoutes from './routes/user.route.js'
import cookieParser from 'cookie-parser'
import messageRoutes from './routes/message.route.js'
import cors from "cors"
import { app, server, io } from './lib/socket.js'
import path from "path"
import { fileURLToPath } from "url"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Middleware
app.use(express.json({ limit: '1000mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ✅ Dynamic CORS for dev vs prod
const allowedOrigins = [
  "http://localhost:5173", // local dev frontend
  process.env.FRONTEND_URL // deployed frontend (set in .env)
]

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
)

// Routes
app.use('/user', userRoutes)
app.use('/message', messageRoutes)

// ✅ Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist")
  app.use(express.static(frontendPath))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"))
  })
}

const port = process.env.PORT || 5000

server.listen(port, () => {
  database()
  console.log(`✅ Server running on http://localhost:${port}`)
})
