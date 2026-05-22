import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave:false})

    return {accessToken,refreshToken}

  } catch (error) {
    throw new ApiError(500,"Something went wrong while generating access and refresh token")
    
  }
}


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

   const avatarLocalPath = req.files?.avatar?.[0]?.path

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

const loginUser = asyncHandler(async (req,res) => {
   
    // get email & password from frontend / postman
    // valid email - means check if this user email exist in database or not
    // check password : if wrong , dont proceed further. 
    // generate accesstoken , generate refreshtoken
    // save refrestoken in db
    // send response

    const {email , username , password} = req.body
    if(!username || !email)return new ApiError(402,"username or email is required");

    const user =  await User.findOne({
        $or:[{username} , {email}]
    })

   if(!user) return new ApiError(404,"Please register first");
   
   const isPasswordValid = await user.isPasswordCorrect(password)
   if(!isPasswordValid) return new ApiError(404,'Invalid Password');

   const {accessToken , refreshToken } = await generateAccessAndRefreshToken(user.__id);

   const options = {   // Because default cookies can be modified by frontend , so doing this stops it tho
    httpOnly:true,
    secure:true,
   }

   return res
   .status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json(
    new ApiResponse(
        200,
        "User Logged in Successfully"
    )
   )

})

const logoutUser = asyncHandler(async (req,res) => {
    
})

export {
    registerUser,
    loginUser,
};
