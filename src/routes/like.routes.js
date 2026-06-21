import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js";

const router = Router()

router.route('/toggle/v/:videoId').post(verifyJWT , toggleVideoLike)
router.route('/toggle/c/:commentId').post(verifyJWT, toggleCommentLike)
router.route('/toggle/t/:tweet').post(verifyJWT,toggleTweetLike)
export default router;
