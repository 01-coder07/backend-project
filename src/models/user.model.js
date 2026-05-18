import { JsonWebTokenError } from "jsonwebtoken";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    watchHistory:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Video',
    }],
    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        required:true,
    },
    coverImage:{
        type:String,
    },
    password:{
        type:String,
        required:true, 
    },
    refreshToken:{
        type:String,
    },
},{timestamps:true})


// userSchema.pre('save',()=>{})  this is wrong as arrow function doesnt have this keyword.and we need this keyowrd here.
userSchema.pre('save', async function (next){
  if(!this.isModified('password'))return next()
  this.password = bcrypt(this.password,10)
  next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    JsonWebTokenError.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    JsonWebTokenError.sign(
        {
            _id:this._id,
           
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
        }
    )
}

export const User = mongoose.model('User',userSchema)