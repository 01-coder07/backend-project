import { asyncHandler } from "../utils/asyncHandler";
import {ApiError} from '../utils/ApiError.js'

export const verifyJWT = asyncHandler(async (req , res , next) =>{
      const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer " ,"");

      if(!token){
            throw new ApiError(401,"Unauthorized request");
      }

})