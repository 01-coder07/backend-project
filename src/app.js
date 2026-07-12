// import express
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true,
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(cookieParser())

// separtion of routes from abovee middlewares
import userRoutes from './routes/user.routes.js';
app.use('/api/v1/users',userRoutes)


import likeRoutes from "./routes/like.routes.js";
app.use('/api/v1/likes',likeRoutes)

import videoRoutes from "./routes/video.routes.js";
app.use('/api/v1/videos',videoRoutes)

import commentRoutes from "./routes/comment.routes.js";
app.use('/api/v1/videos',commentRoutes)

import subscriptionRoutes from "./routes/subscription.routes.js";
app.use('/api/v1/videos',subscriptionRoutes)

// http://localhost:8000/api/v1/users/register



export default app