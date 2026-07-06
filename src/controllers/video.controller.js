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


const getVideo = asyncHandler(async(req,res)=>{
   const videoId = req.params.id;
   if(!videoId) throw new ApiError(400,'no video exist')
    const video = await Video.findById(videoId);
   if(!video)throw new ApiError(400,'Video doesnt exist')

   return res.json(new ApiResponse(200,video,"video fetched successfully"))
})

const updateVideo = asyncHandler(async (req,res) =>{
   const videoId = req.params.videoId;

   const video = await Video.findById(videoId);
   if(!video)throw new ApiError(400,'This video doesnt exist in database');

   const user = req.user._id.toString();

   if(video.owner.toString() !== user) throw new ApiError(404,'You are not authorised to update video');
   const updateFields = {};
   // first we wants  title , description , thumbnail
   const { title , description } = req.body;
   if(title) updateFields.title = title;
   if(description) updateFields.description = description;
   
   const thumbnailLocalPath = req.file?.path;
   if(thumbnailLocalPath) {
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    updateFields.thumbnail = thumbnail.url
   }
   if(Object.keys(updateFields).length === 0) throw new ApiError(400,'No updating fields are required')
   
   // console.log(thumbnail.url)

     const updatedVideoInDatabase = await Video.findByIdAndUpdate(
      videoId, 
     {$set: updateFields},
     {new : true},
     )

     return res.json(new ApiResponse(200,updatedVideoInDatabase,'Video is successfully updated'));
   
})

const deleteVideo = asyncHandler(async (req,res) =>{
 
   const videoId = req.params.videoId;
   const video = await Video.findById(videoId)
   if(!video) throw new ApiError(400,'No video exist');

   const owner = video.owner.toString();
   const user = req.user._id.toString();
   if(owner !== user) throw new ApiError(400,'You are not the owner');

   await Video.findByIdAndDelete(video)
   return res.json(new ApiResponse(200,{},'Video deleted successfully'));
})

export { uploadVideo , getVideo , updateVideo , deleteVideo }