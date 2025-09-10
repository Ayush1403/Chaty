import express from 'express'
import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import Users from '../models/user.model.js'


export const protectRoute = async(req,res,next)=>{
    try{
        const tokens = req.cookies?.token;

        if(!tokens){
            return res.status(401).json({success:false,message:"No token found"})
        }

        const decode = jwt.verify(tokens, process.env.JWT_SECRET)

        if(!decode){
           return res.status(401).json({message:"Unauthorized Access"})
        }

        const user = await Users.findById(decode.userID).select('-password');

        req.user = user;

        next();

    }catch(error){
        res.status(500).json({message:"Server error"})
    }
}