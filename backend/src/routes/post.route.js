import Router from 'express';
import {
    createPost,
    updatePost,
    deletePost,
    getAllPosts,
    getPost,
    getCurrentUserPosts
} from '../controllers/post.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const router = Router();

router.use(verifyJWT)
router.route('/').get(getAllPosts);
router.route('/createPost').post(upload.single('thumbnail'),createPost);
router.route('/currentUserPosts').get(getCurrentUserPosts)
router.route('/:postId')
    .get(getPost)
    .patch(upload.single('thumbnail'),updatePost)
    .delete(deletePost);

export default router;