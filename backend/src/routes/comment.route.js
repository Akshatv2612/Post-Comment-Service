import Router from 'express'
import {
    createComment,
    updateComment,
    deleteComment,
    getComments
} from '../controllers/comment.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

/* `const router = Router()` is creating a new instance of the Express Router class, which allows you
to define routes for your application. This instance will be used to define the routes for handling
HTTP requests in your application. */
const router = Router()

/* This code snippet is setting up routes for handling HTTP requests related to comments in an Express
application.*/
router.use(verifyJWT)
router.route('/p/:postId')
    .get(getComments)
    .post(createComment)

router.route('/c/:commentId')
    .patch(updateComment)
    .delete(deleteComment)

export default router