import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const uploadVideo = asyncHandler(async( req , res )=>{
    // title , description from req body
   const {title,description} =  req.body;
   if(!title) throw new ApiError(404,'Please provide title');
   
   // local files from multer.
   const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
   const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

   if(!videoFileLocalPath) throw new ApiError(404,'Provide Video')
   if(!thumbnailLocalPath)throw new ApiError(404,'Provide thumbnail')
 
    // uploads in cloudinary
    const videoFilePath = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnailPath = await uploadOnCloudinary(thumbnailLocalPath);
    if(!videoFilePath)throw new ApiError(404,'Video Didnt uploaded in cloudinary')
    if(!thumbnailPath) throw new ApiError(404,'Thumbnail not uploaded in cloudinary');


   // owner:user
   const user = req.user?._id;
   if(!user) throw new ApiError(404,'User not found');

   // duration of videoFile
   const duration = videoFilePath.duration;

   // database entry
   const video = await Video.create({
     videoFile:videoFilePath.url,
     thumbnail:thumbnailPath.url,
     owner:user,
     title,
     description,
     duration,
   })

   // response
   return res.json(new ApiResponse(200,video,'Video uploaded Successfully'));
   
})

export {uploadVideo}