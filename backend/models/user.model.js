import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
    {
        username:{
            type:String,
            required: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
            match:[/^\S+@\S+\.\S+$/,"Enter valid email"]
        },
        password:{
            type: String,
            required: true,
            minLength:6,
        },
        profilepic:{
            type:String,
            default:""
        },
       
    },{timestamps:true}
)


const Users = mongoose.model("User",userSchema)




export default Users;