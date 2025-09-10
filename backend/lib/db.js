import mongoose, { connect } from "mongoose";

export const database = async () =>{
  
   try{
     const con =await mongoose.connect(process.env.DB_STRING);
     console.log(`MongoDb Connected ${con.connection.host}`);
   }catch(error){
    console.log(`error ${error.message}`);
    process.exit(1);
   }
    
}