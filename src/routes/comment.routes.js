import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {addComment, deleteComment ,updateComment } from "../controllers/comment.controller.js";

const router = Router();

router.route('/:videoId/comments').post(verifyJWT,addComment)

router.route('/:id').get(verifyJWT,deleteComment)

router.route('/:commentId').patch(verifyJWT,updateComment)

export default router