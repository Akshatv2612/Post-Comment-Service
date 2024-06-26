import Router from 'express'
import {
    createComment,
    updateComment,
    deleteComment,
    getComments
} from '../controllers/comment.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'

const router = Router()

router.use(verifyJWT)
router.route('/p/:postId')
    .get(getComments)
    .post(createComment)

router.route('/c/:commentId')
    .patch(updateComment)
    .delete(deleteComment)

export default router