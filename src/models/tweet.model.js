import mongoose, { mongo } from "mongoose";


const tweetSchema = mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    content:{
        type:String,
        required:true,
    },  
},{Timestamp:true})

export const Tweet = mongoose.model('Tweet',tweetSchema)