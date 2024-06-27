import mongoose from "mongoose";
import { Post } from "../models/post.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

/* The `createPost` function is responsible for handling the creation of a new post.*/
const createPost = asyncHandler(async (req, res) => {
    const { title, content, isPublished } = req.body;
    if (!title) {
        throw new ApiError(400, "Title is required")
    }
    if (!content) {
        throw new ApiError(400, "Content is required")
    }
    const user = req.user
    const thumbnailLocalPath = req.file?.path
    if (!thumbnailLocalPath) {
        throw new ApiError(402, 'Thumbnail required')
    }
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    if (!thumbnail) {
        throw new ApiError(405, 'Thumbnail not uploaded to cloudinary')
    }

    const post = await Post.create({
        title,
        content,
        isPublished,
        owner: user._id,
        thumbnail: thumbnail?.url || ""
    })

    return res
        .status(200)
        .json(
            new ApiResponse(200, post, "Post created successfully")
        )
})

/* The `updatePost` function is responsible for handling the updating of an existing post.*/
const updatePost = asyncHandler(async (req, res) => {
    const { title, content, isPublished } = req.body
    if (!title) {
        throw new ApiError(400, "Title is required")
    }
    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const { postId } = req.params
    const post = await Post.findById(postId)

    if (!post) {
        throw new ApiError(404, "Post not found")
    }

    const userId = req.user._id;
    if (!post.owner.equals(userId)) {
        throw new ApiError(403, "User not authorized to update this post")
    }

    const thumbnailLocalPath = req.file?.path

    let thumbnail;
    if (thumbnailLocalPath) {
        thumbnail = await uploadOnCloudinary(thumbnailLocalPath);
    }

    try {
        if (thumbnail) {
            deleteFromCloudinary(post.thumbnail)
        }
    } catch (error) {
        throw new ApiError(405, 'Thumbnail not deleted from cloudinary')
    }

    const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
            title,
            content,
            isPublished,
            thumbnail: thumbnail?.url || post.thumbnail
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedPost, "Post updated successfully")
        )
})

/* The `deletePost` function is responsible for handling the deletion of a post.*/
const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params
    const post = await Post.findById(postId)

    if (!post) {
        throw new ApiError(404, "Post not found")
    }

    const userId = req.user._id

    if (!post.owner.equals(userId)) {
        throw new ApiError(403, "User not authorized to delete this post")
    }

    const deleted = await Post.findByIdAndDelete(postId)

    if (!deleted) {
        throw new ApiError(500, "Error while deleting the post")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Post deleted successfully")
        )
})

/* The `getAllPosts` function is responsible for fetching all posts that are marked as published
(`isPublished: true`).*/
const getAllPosts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 100 } = req.query

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    const aggregateQuery = Post.aggregate([
        {
            $match: {
                isPublished: true
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullname: 1,
                        }
                    }
                ]
            }
        }
    ]);

    const posts = await Post.aggregatePaginate(aggregateQuery, options);

    return res
        .status(200)
        .json(
            new ApiResponse(200, posts, "All posts fetched successfully")
        )
})

/* The `getPost` function is responsible for fetching a specific post based on the `postId` parameter
provided in the request.*/
const getPost = asyncHandler(async (req, res) => {

    const { postId } = req.params

    const post = await Post.findById(postId)

    if (!post) {
        throw new ApiError(400, "Error while finding post")
    }

    const owner = await User.findById(post.owner).select("username fullname")

    const newPost = Object(post)
    newPost.owner=owner

    return res
        .status(200)
        .json(
            new ApiResponse(200, newPost, "Post fetched successfully")
        )
})

/* The `getCurrentUserPosts` function is responsible for fetching all posts that belong to the
currently authenticated user.*/
const getCurrentUserPosts = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
    };

    const aggregateQuery = Post.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",
                pipeline: [
                    {
                        $project: {
                            username: 1,
                            fullname: 1
                        }
                    }
                ]
            }
        }
    ]);

    const posts = await Post.aggregatePaginate(aggregateQuery, options);

    return res
        .status(200)
        .json(
            new ApiResponse(200, posts, "All posts fetched successfully")
        )
})

export {
    createPost,
    updatePost,
    deletePost,
    getAllPosts,
    getPost,
    getCurrentUserPosts
}