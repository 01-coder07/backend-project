import { Like } from "../models/likes.model.js";
import { ApiError  } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleVideoLike  = asyncHandler(async (req , res) => {
    const videoId = req.params.videoId;
    if(!videoId){
        throw new ApiError(404 , "No video");
    }
    const user = req.user?._id;
    if(!user){
        throw new ApiError(400,'No user present');
    }

    const existingLike = await Like.findOne({ video : videoId , likedBy : user});
    if(existingLike){
      const unlike = await Like.findByIdAndDelete(existingLike._id);
      return res.status(200).json(new ApiResponse(200,{},"Unliked Successfully"));
    }
    else {
        const like = await Like.create({video : videoId , likedBy: user});
        return res.status(200).json(new ApiResponse(200,like,'Liked Successfully'));
    }
    

})

export {toggleVideoLike};