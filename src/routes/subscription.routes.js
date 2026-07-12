import { Router } from 'express'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { getUserChannelSubscriber, toggleVideoSubscribe , getSubscribedChannels} from '../controllers/subscription.controller.js';

const router = Router();
router.route('/:channelId/subscribe').post(verifyJWT , toggleVideoSubscribe);
router.route('/subscriptions/:id/userSubscribers').get(verifyJWT,getUserChannelSubscriber);
router.route('/subscribed/:id').get(verifyJWT,getSubscribedChannels)
export default router;
