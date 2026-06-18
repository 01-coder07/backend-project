import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { toggleCommentLike, toggleVideoLike } from "../controllers/like.controller.js";

const router = Router()

router.route('/toggle/v/:videoId').post(verifyJWT , toggleVideoLike)
router.route('/toggle/c/:commentId').post(verifyJWT, toggleCommentLike)

export default router;
