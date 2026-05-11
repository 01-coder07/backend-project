// require('dotenv').config()

import dotenv from 'dotenv'
import mongoose from "mongoose";
import connectDB from "./db/db.js";

dotenv.config({
  path:'./env'
})

connectDB()
.then(()=>{
  app.listen(process.env.PORT || 8000 , ()=>{
    console.log(`Server is running on port ${process.env.PORT}`)
  })
  app.on("error",(err)=>{
   console.log(`Error`,err)
  })
})
.catch((err)=>{
  console.log(`MongoDB Connection Failed`,err)
}) 


// const startServer = async () => {
//      try {
//       app.listen(process.env.PORT || 8000,()=>{
//         console.log(`Server is on ${process.env.PORT}`)
//       })

//      }
//      catch(e){
//       console.log(e);
//      }
// }
// startServer()









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