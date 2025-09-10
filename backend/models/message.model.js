import mongoose from "mongoose";

const messsageSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reciverId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text:{
        type: String,
      
    },
    image:{
      type: String,
    },

},{timestamps: true})


const Message = mongoose.model("Messages",messsageSchema);

export default Message