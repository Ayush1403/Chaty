import express from 'express'
import mongoose from 'mongoose'
import Users from '../models/user.model.js';
import Message from '../models/message.model.js'
import cloud from '../lib/cloud.js';
import { getReciver , io } from '../lib/socket.js';

export const UserSideBar = async(req,res)=>{
    try {
        const loggedIn = (req.user._id);
       
        const filteredUser = await Users.find({_id: {$nin: loggedIn}}).select("-password")

        res.status(200).json(filteredUser);
    } catch (error) {
        res.status(500).json({message: "Internal server error"});
    }
}
export const MessageWindow = async (req, res) => {
  try {
    const { id: userChattingId } = req.params;
    const senderId = req.user._id;

    if (!userChattingId) {
      return res.status(400).json({message: "Chat user ID is required" });
    }

    const messages = await Message.find({
      $or: [
        { senderId, reciverId: userChattingId },
        { senderId: userChattingId, reciverId: senderId }
      ]
    }).sort({ createdAt: 1 });

    if (!messages || messages.length === 0) {
      return res.status(404).json({ message: "No messages found between users" });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("MessageWindow Error:", error.message);
    res.status(500).json({ error: "Failed to fetch messages", details: error.message });
  }
};

// Send message
export const SendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: reciverId } = req.params;
    const senderId = req.user._id;

    if (!reciverId) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    if (!text && !image) {
      return res.status(400).json({ message: "Message must contain either text or image" });
    }

    let imageUrl = null;
    if (image) {
      try {
        const uploadResponse = await cloud.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      } catch (uploadError) {
        return res.status(500).json({ message: "Image upload failed", details: uploadError.message });
      }
    }

    const newMessage = new Message({
      senderId,
      reciverId,
      text,
      image: imageUrl
    });

    const reciverSocketId = getReciver(reciverId);
    if(reciverSocketId){
      io.to(reciverSocketId).emit("new",newMessage)
    }

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("SendMessage Error:", error.message);
    res.status(500).json({ message: "Failed to send message", details: error.message });
  }
};