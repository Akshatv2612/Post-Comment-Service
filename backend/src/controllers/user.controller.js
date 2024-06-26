import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })  //since 'save' validate each field and here we don't have password etc. 

        return { accessToken, refreshToken }
    }
    catch (error) {
        throw new ApiError(406, "Error while generating Access Token or Refresh Token", error)
    }
}

const registerUser = asyncHandler(async (req, res, next) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object — create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response
    const { username, email, fullname, password } = req.body

    if ([username, email, fullname, password].some((field) => !field?.trim()))  //?. is optional chainning operator, It will not throw error if method in not there.
    {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError(401, 'Username or Email already present')
    }

    const user = await User.create({
        username: username.toLowerCase(),
        fullname,
        email,
        password
    })

    const createdUser = await User.findOne(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(405, "Something went wrong while registering user")
    }

    return res.status(200).json(
        new ApiResponse(200, createdUser, "user registered successfully")
    )
});

const loginUser = asyncHandler(async (req, res) => {
    //Get data from user
    //check data
    //find data in database
    //password check
    //create access and refresh token
    //send tokens through cookie

    const { username, email, password } = req.body
    if (!(username || email)) {
        throw new ApiError(400, "Username or Email is required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (!user) {
        throw new ApiError(405, "User not registered")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
        throw new ApiError(401, "Password Incorrect")
    }

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: false,
        secure: false
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "Logged In Successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    const userr = await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200,
                {},
                "User Logged Out Successfully"
            )
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    res
        .status(200)
        .json(
            new ApiResponse(200, req.user, "Current User fetched Succcessfully")
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const userRefreshToken = req.cookies.refreshToken || req.body.refreshToken
    if (!userRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedRefreshToken = Jwt.verify(userRefreshToken, process.env.REFRESH_TOKEN_SECRET)

        const user = await User.findById(decodedRefreshToken._id)

        if (!user) {
            throw new ApiError(402, "Refresh Token is invalid")
        }

        if (userRefreshToken !== user.refreshToken) {
            throw new ApiError(403, "Refresh Token Not Matched")
        }
        const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    },
                    "Access Token Refreshed Successfully"
                )
            )
    } catch (error) {
        throw new ApiError(404, "Unable to refresh Access Token", error)
    }
})

export {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    refreshAccessToken
}