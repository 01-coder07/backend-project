import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () =>{

    try{
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL)
        console.log(`MongoDB ConnectionInstance : ${connectionInstance.connection.host}`)
    }
    catch(e){
        console.log('MongoDB Connection Failed',e);
        process.exit(1)
    }
}
export default connectDB;
