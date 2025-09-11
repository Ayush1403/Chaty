import express from 'express'
import dotenv from 'dotenv'
import { database } from './lib/db.js';
import userRoutes from './routes/user.route.js'
import cookieParser from 'cookie-parser';
import messageRoutes from './routes/message.route.js'
import cors from "cors"
import {app, server , io} from './lib/socket.js'
import path from 'path'

dotenv.config();

app.use(express.json({limit: '1000mb'}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const port = process.env.PORT

const __dirname = path.resolve();
app.use(cors(
   { 
    origin:"http://localhost:5173",
     methods: ['GET','POST','PUT','DELETE'],
    credentials: true
}
))

app.use('/user',userRoutes)
app.use('/message',messageRoutes)
if(process.env.NODE_ENV==="production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")))

    app.get(".*",(req,res)=>{
        res.sendFile(path.join((__dirname,"../frontend" , "dist" , "index.html")));
    })
}

server.listen(port,()=>{
    database();
    console.log(`Server is running on port http://localhost:${port}`)
});
