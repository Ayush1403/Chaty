import express from 'express'
import { MessageWindow, UserSideBar,SendMessage } from '../controller/message.controller.js';
import { protectRoute } from '../middleware/protectRoute.middleware.js';

const router = express.Router();

router.get("/user", protectRoute ,UserSideBar)
router.get("/:id",protectRoute,MessageWindow)


router.post("/send/:id",protectRoute,SendMessage)
export default router