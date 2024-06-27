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

/* `const router = Router();` is creating a new instance of the Express Router class, which will be
used to define the routes for the application. This instance will be used to define the various HTTP
routes and their corresponding handlers for the post-related functionality in the application. */
const router = Router();

/* This code snippet is defining the routes and corresponding HTTP methods for handling post-related
functionality in an Express application.*/
router.use(verifyJWT)
router.route('/').get(getAllPosts);
router.route('/createPost').post(upload.single('thumbnail'),createPost);
router.route('/currentUserPosts').get(getCurrentUserPosts)
router.route('/:postId')
    .get(getPost)
    .patch(upload.single('thumbnail'),updatePost)
    .delete(deletePost);

export default router;