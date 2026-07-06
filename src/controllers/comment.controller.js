import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const addComment = asyncHandler(async (req,res)=>{

    /* Steps:
      1.get the user id (we ll get it by jwt since the user should be logged in to comment)
      2.get the video id
      3.fetch the comment content 
      4.store all the details in comment database as per the scehma
      4.return a response
    */

      const user = req.user._id;
      const video = req.params.videoId;
      if(!video)throw new ApiError(400,'No video found');

      const { comment } = req.body;
      if(!comment)throw new ApiError(404,'Please comment something');

      const commentDatabase = await Comment.create({
        content:comment,
        video,
        owner:user,
      })
  
      return res.json(new ApiResponse(200,commentDatabase,'Comment Created'));
})

const deleteComment = asyncHandler(async (req,res)=>{
    
    /* 
     1. get the commentId
     2. get the userid
     3. check if the commentId matches userid in comment database
     4. if does then delete 
     5. return res
    */
   const commentId = req.params.id;

   const user = req.user._id;

   const comment = await Comment.findById(commentId);
   if(!comment) throw new ApiError(200,'comment not found');
 
   if(comment.owner.toString() !== user.toString()) throw new ApiError(404,'You cannot delete others comments');

   const deletedComment = await Comment.findByIdAndDelete(commentId);

   return res.json(new ApiResponse(200,{},'comment deleted'));

})

const updateComment = asyncHandler(async(req,res)=>{
   
  /* 
    1.get the commentId
    2.get the userId
    3.find the comment document with commentId
    4.now we need to check if that document is of that user
    5.we ll let user update content 
    6.then save it in database
    7.return a respone
  */

    const commentId = req.params.commentId;
    const user = req.user._id;

    const comment = await Comment.findById(commentId);
    if(!comment)throw new ApiError(404,'No comments here');

    if(comment.owner?.toString() !== user?.toString()){
      throw new ApiError(404,'You cannot edit content');
    }

    const { content } = req.body
    const updatedComment = await Comment.findByIdAndUpdate
    (
      commentId , 
      {$set:{content}},
      {new : true},
    )
    return res.json(new ApiResponse(200,updatedComment,'Comment updated'))
})


export {addComment , deleteComment, updateComment};
