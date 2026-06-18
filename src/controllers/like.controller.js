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


const toggleCommentLike = asyncHandler(async (req,res) =>{
       
    const commentId = req.params.commentId;
    if(!commentId){
        throw new ApiError(400,'No comment');
    }
    const user = req.user._id
    if(!user){
        throw new ApiError(401,'No user');
    }
    
    const exisitingCommentLike = await Like.findOne({comment:commentId , likedBy:user})
    if(!exisitingCommentLike){
        await Like.create({
            comment:commentId,
            likedBy:user,
        })
        return res.
        json(new ApiResponse(200,{},'Comment Liked Successfully'));
    }
    else{
        await exisitingCommentLike.deleteOne();
        return res.json(new ApiResponse(200,{},'Comment Unliked Successfully'));
    }
})


export {toggleVideoLike,
    toggleCommentLike,
};