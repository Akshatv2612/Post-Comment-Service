import { asyncHandler } from "../utils/AsyncHandler.js";
import Jwt from "jsonwebtoken";
import { User} from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

/* The `verifyJWT` function is a middleware function used for verifying JSON Web Tokens (JWT) in a
Node.js*/
const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        if (!token) {
            throw new ApiError(401, "Access Token is absent")
        }

        const decodedToken = Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(402, "Invalid Access Token")
        }

        req.user = user;
        next();
    } catch (error) {
        console.log(error)
        throw new ApiError(404, "Unable to verify JWT", error)
    }
})

export {verifyJWT}