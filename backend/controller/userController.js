import express from 'express'
import Users from '../models/user.model.js'
import bcrypt from 'bcrypt'
import { token } from '../lib/util.js'
import cloud from '../lib/cloud.js'

export const createUser = async(req,res)=>{
    const {username,email,password} = req.body;
    try{
       
       if(!username||!email||!password){
         return res.status(400).json({success: false,message:"all field required"})
       }
        const existingUser = await Users.findOne({email: email});
       if(existingUser){
            return res.status(400).json({success: false,message:"user their"})
        }

        if(password.length<6){
             return res.status(400).json({success: false,message:"too short"})
        }

           const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
     
          const user =new Users({
            username,
            email,
            password:hashedPassword
          });
       if(user){
        await user.save();
          token(user._id,res)
          
          res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email
      }
    })
       }else{
          return res.status(400).json({success: false,
           message:"internal server error"
          })
       }

     
     
    }catch(error){
        console.log(error.message)
    }
}


export const loginUser = async(req,res)=>{
    const {email,password} = req.body;

    try{
       const existingUser = await Users.findOne({email: email});
       if(!existingUser){
         return res.status(400).json({success: false,message:"invalid email or password"})
        }

        const isPassword = await bcrypt.compare(password,existingUser.password)
        
        if(!isPassword){
            return res.status(400).json({success: false,message:"invalid email or password"})
        }
        token(existingUser._id,res)
         res.status(201).json({ _id:existingUser._id,
            username:existingUser.username,
            email,
            password,})
       }
    
    catch(error){
        console.log("error message",error.message)
    }
}

export const logoutUser = async (req,res) => {
  try{
    res.cookie("token","",{
      maxAge: 0,
    }
  )
  res.status(201).json({success: true,message:"logout successfully"})
  }catch(error){
    console.log("faliled because ",error)
  }
}


export const updateProfile = async(req,res)=>{
  const {profilepic} = req.body;
try {
    const userID = req.user._id
  if(!profilepic){
    return res.status(401).json({message:"Image not their"})
  }
const Response = await cloud.uploader.upload(profilepic)
const updatePro = await Users.findByIdAndUpdate(userID,{profilepic:Response.secure_url},{new:true})
res.status(200).json(updatePro)
} catch (error) {
  res.status(500).json({message:"Internal server error"})
}
}

export const checkAuth = (req,res) => {
  try {
    res.status(200).json(req.user)
  } catch (error) {
    console.log("error in checkAuth",error.message)
      res.status(500).json({message:"Internal server error"})
  }
}