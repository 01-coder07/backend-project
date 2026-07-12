import mongoose from 'mongoose';
import {asyncHandler} from '../utils/asyncHandler.js';
import {Subscription} from '../models/subscriptions.model.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const toggleVideoSubscribe = asyncHandler(async(req,res) =>{
    const userId = req.user._id;
    const channelId = req.params.channelId;

    const subscription = await Subscription.findOne({channel:channelId , subscriber:userId})
    if(!subscription){
        const subscribe = await Subscription.create({channel: channelId, subscriber:userId})
        return res.json(new ApiResponse(200,subscribe,'Subscribed'));
    }
    const unsubscribe = await Subscription.findByIdAndDelete(subscription._id);
    return res.json(new ApiResponse(200,{},'unsubscribed'));

})


const getUserChannelSubscriber = asyncHandler(async(req,res)=>{
     const channelId = req.params.id;

     const subscribers = await Subscription.find({channel:channelId}).populate("subscriber" ,"username email fullName");
     return res.json(new ApiResponse(200,subscribers,'subscriber fetched successfully'));
    
})

const getSubscribedChannels = asyncHandler(async(req,res) =>{
    const userId = req.params.id;
    const subscribedChannels = await Subscription.find({subscriber:userId}).populate("channel","username email fullName avatar")
    return res.json(new ApiResponse(201,subscribedChannels,"User Subscribed Channels fetched successfully"));
})

export {toggleVideoSubscribe , getUserChannelSubscriber , getSubscribedChannels}