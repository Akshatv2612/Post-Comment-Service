import mongoose from "mongoose";
import {Comment} from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";

/* The `createComment` function is responsible for creating a new comment.*/
const createComment = asyncHandler(async (req, res) => {
    const { content } = req.body;
    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const user = req.user
    const { postId } = req.params

    const comment = await Comment.create({
        content,
        owner: user._id,
        post: postId
    })

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                { comment },
                "Comment Created Successfully"
            )
        )
})

/* The `updateComment` function is responsible for updating an existing comment.*/
const updateComment = asyncHandler(async (req, res) => {
    const { content } = req.body

    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const { commentId } = req.params
    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    const userId = req.user._id

    if (!comment.owner.equals(userId)) {
        throw new ApiError(403, "User not authorized to update this comment")
    }

    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            content
        },
        {
            new: true
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { updatedComment },
                "Comment Updated Successfully"
            )
        )
})

/* The `deleteComment` function is responsible for deleting a comment.*/
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params
    const comment = await Comment.findById(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    const userId = req.user._id

    if (!comment.owner.equals(userId)) {
        throw new ApiError(403, "User not authorized to delete this comment")
    }

    await Comment.findByIdAndDelete(commentId)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Comment Deleted Successfully"
            )
        )
})

/* The `getComments` function is responsible for fetching comments associated with a specific post.*/
const getComments = asyncHandler(async (req, res) => {
    const { postId } = req.params
    const { page = 1, limit = 100 } = req.query

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }

    const aggregateQuery = Comment.aggregate([
        {
            $match: {
                post: new mongoose.Types.ObjectId(postId)
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
    ])

    const comments = await Comment.aggregatePaginate(aggregateQuery, options)

    if (!comments) {
        throw new ApiError(410, "Error while fetching Comments")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, comments, "Comments fetched successfuly")
        )
})

export {
    createComment,
    updateComment,
    deleteComment,
    getComments
}