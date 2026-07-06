import { Router } from "express";
import { deleteVideo, getVideo, updateVideo, uploadVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router()

router.route('/uploadVideo').post(
    upload.fields([
        {
          name:"videoFile",
          maxCount:1,
        },
        {
            name:'thumbnail',
            maxCount:1,
        }
    ])
    ,verifyJWT , uploadVideo)

router.route('/video/:id').get(getVideo)

router.route('/video/update/:videoId').patch(verifyJWT,upload.single('thumbnail'),updateVideo)

router.route('/video/delete/:videoId').delete(verifyJWT,deleteVideo);

export default router