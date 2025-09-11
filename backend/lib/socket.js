import { Server, Socket } from 'socket.io'
import http from 'http'
import express from 'express'


const app = express();
const server=http.createServer(app);


const io = new Server(server,{
    cors: {
        origin:["http://localhost:5173"],
        credentials: true,
    }
});

export function getReciver(userId){
    return socketOnline[userId];
}

const socketOnline ={}




io.on("connection", (socket)=>{
    console.log("A user connected", socket.id);
    const userId = socket.handshake.auth.userId

    if(userId){
        socketOnline[userId]=socket.id
    }
io.emit("getOnline",Object.keys(socketOnline))

socket.on("disconnect" , ()=>{
    console.log("user disconnected", socket.id)
    delete socketOnline[userId]
    io.emit("getOnline",Object.keys(socketOnline))
})
})



export {io,app,server}

