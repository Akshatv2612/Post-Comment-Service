import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors"
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

dotenv.config({
    path:'./.env'
})

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from './routes/user.route.js'
import postRouter from './routes/post.route.js'
import commentRouter from './routes/comment.route.js'

//routes declaration
app.use('/api/v1/users',userRouter)
app.use('/api/v1/posts',postRouter)
app.use('/api/v1/comments',commentRouter)

//error handler
app.use(errorHandler)

export default app