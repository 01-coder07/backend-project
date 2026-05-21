import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const registerUser = asyncHandler(async (req,res) => {

   // get user details from frontend
   // validation  - not empty
   // check if user already exist : username , email
   // check for images, check for avatar
   // upload them to cloudinary 
   // create user object - create user in db
   // remove password and refresh token from response
   // check for user creation
   // return response

   const { fullName, username , email ,password } = req.body
   console.log("name:",fullName);
   if(fullName === "") throw  new ApiError(400,"Please Enter Name")
   if(username === "") throw new ApiError(400,"please enter username")
   if(email === "") throw new ApiError(400,"Please enter email");
   if(password === "") throw new ApiError(400,"Please enter password");
 
   const existedUser = await User.findOne({
    $or: [{ username } , { email }]
   })
   

   if(existedUser) throw new ApiError(401,"User already exist!");

   const avatarLocalPath = req.files?.avatar[0]?.path
   const coverImageLocalPath = req.files?.coverImage?.[0]?.path

   if(!avatarLocalPath)  throw new ApiError(400,'Avatar file is requried')

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400,'Avatar file is requried')
    }
    
   const user = await User.create({
        fullName,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        username:username.toLowerCase(),
        email,
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,'Something went wrong while registering user')
    }

    return res.status(201).json(new ApiResponse(200,createdUser,"User registered Succesfully"));

})

export {registerUser};
