import express from 'express'
import dotenv from 'dotenv'
import { database } from './lib/db.js'
import userRoutes from './routes/user.route.js'
import messageRoutes from './routes/message.route.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { app, server, io } from './lib/socket.js'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Validate essential env variables
if (!process.env.FRONTEND_URL) {
  throw new Error("FRONTEND_URL is not defined in .env")
}

// Middleware
app.use(express.json({ limit: '1000mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Dynamic CORS for dev vs prod
const allowedOrigins = [
  "http://localhost:5173", // local dev frontend
  process.env.FRONTEND_URL // deployed frontend
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

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist")
  app.use(express.static(frontendPath))

  // ✅ Catch-all route using regex (compatible with Express v5)
  app.get(/.*/, (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"))
  })
}

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: "Something went wrong!" })
})

const port = process.env.PORT || 5000

// Connect to DB first, then start server
database()
  .then(() => {
    server.listen(port, () => {
      console.log(`✅ Server running on http://localhost:${port}`)
    })
  })
  .catch(err => {
    console.error("❌ Database connection failed:", err)
    process.exit(1)
  })
