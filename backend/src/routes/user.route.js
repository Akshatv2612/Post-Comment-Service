import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    refreshAccessToken
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

/* `const router=Router()` is creating a new instance of the Express Router class, which is used to
define routes for your application. This instance will be used to define the different routes for
user registration, login, logout, refreshing access token, and getting current user information in
your application. */
const router=Router()

/* This code snippet is defining different routes using the Express Router instance `router`.*/
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(verifyJWT,refreshAccessToken)
router.route("/").get(verifyJWT, getCurrentUser)

export default router