import express from 'express'


import mongoose from 'mongoose'
import {createUser,loginUser,logoutUser,checkAuth, updateProfile} from '../controller/userController.js'
import { protectRoute } from '../middleware/protectRoute.middleware.js';
const router = express.Router();

router.post('/signup',createUser)
router.post('/login',loginUser)
router.post('/logout',logoutUser)


router.put('/update',protectRoute,updateProfile)


router.get('/check',protectRoute,checkAuth)

export default router;