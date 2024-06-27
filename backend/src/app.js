import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from "cors"
import { errorHandler } from './middlewares/error.middleware.js';

const app = express();

dotenv.config({
    path:'./.env'
})

/* This code snippet is setting up Cross-Origin Resource Sharing (CORS) for the Express application.
Here's what each part does: */
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

/* The code snippet `app.use(express.json({ limit: "10mb" }))` is setting up middleware to parse
incoming JSON data with a limit of 10mb. This allows the Express application to handle JSON data
sent in requests. */
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))
app.use(express.static("public"))
app.use(cookieParser())

/* The code snippet `import userRouter from './routes/user.route.js'`, `import postRouter from
'./routes/post.route.js'`, and `import commentRouter from './routes/comment.route.js` are importing
router modules for handling different API endpoints related to users, posts, and comments
respectively. */
import userRouter from './routes/user.route.js'
import postRouter from './routes/post.route.js'
import commentRouter from './routes/comment.route.js'

/* The code snippet `app.use('/api/v1/users', userRouter)`, `app.use('/api/v1/posts', postRouter)`, and
`app.use('/api/v1/comments', commentRouter)` are setting up routes for handling API endpoints
related to users, posts, and comments respectively. */
app.use('/api/v1/users',userRouter)
app.use('/api/v1/posts',postRouter)
app.use('/api/v1/comments',commentRouter)

/* `app.use(errorHandler)` is setting up a middleware function called `errorHandler` to handle errors
that occur during the processing of requests in the Express application. This middleware function
will be called whenever an error is thrown in any of the previous middleware functions or route
handlers. It allows for centralized error handling and can be used to send appropriate error
responses back to the client. */
app.use(errorHandler)

export default app