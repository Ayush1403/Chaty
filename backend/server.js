import express from 'express'
import dotenv from 'dotenv'
import { database } from './lib/db.js';
import userRoutes from './routes/user.route.js'
import cookieParser from 'cookie-parser';
import messageRoutes from './routes/message.route.js'
import cors from "cors"
import { app, server, io } from './lib/socket.js'
import path from 'path'

dotenv.config();

app.use(express.json({ limit: '1000mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const port = process.env.PORT || 5000;
const __dirname = path.resolve();

// ✅ CORS setup (environment-based)
if (process.env.NODE_ENV === "production") {
  app.use(cors({
    origin: true, // allow all origins for now
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }));
} else {
  app.use(cors({
    origin: "http://localhost:5173", // dev frontend
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }));
}

// ✅ Routes
app.use('/user', userRoutes);
app.use('/message', messageRoutes);

// ✅ Production setup
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // 🔧 FIXED: Use middleware to catch all unmatched routes (avoids path-to-regexp issues)
  app.use((req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// ✅ Start server
server.listen(port, () => {
  database();
  console.log(`🚀 Server is running on http://localhost:${port}`);
});
