// require('dotenv').config()

import dotenv from 'dotenv'
import mongoose from "mongoose";
import connectDB from "./db/db.js";

dotenv.config({
  path:'./env'
})

connectDB()








// IIFE(Immediately invoked function expression) ()();
/* (async ()=>{
   
   try{
      await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
      app.on("Error",(error)=>{
        console.log(error)
        throw error
      })

      app.listen(process.env.PORT,()=>{
        console.log(`Server is running on ${process.env.PORT}`)
      })
   } 
   catch(error){
    console.error('Error:', error);
    throw error
   }
})(); 
*/