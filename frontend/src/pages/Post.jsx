import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import parse from "html-react-parser";
import postService from "../services/post";
import commentService from "../services/comment";
import { Button, CommentCard, Container, Loader, LoaderMSG, RTE } from "../components";
import { setComments, addComment } from "../slices/commentSlice";
import { useForm } from "react-hook-form";
import timeAgo from "../utils/timeInterval";

export default function Post() {
    const dispatch = useDispatch();
    const [post, setPost] = useState(null);
    const time = timeAgo(post?.createdAt)
    const [isAuthor, setIsAuthor] = useState(false)
    const [commenting, setCommenting] = useState(false)
    const [commentMSG, setCommentMSG] = useState(null)
    const [deletion, setDeletion] = useState(false)
    const { postId } = useParams();
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const comments = useSelector((state) => state.comment.comments);
    const { control, watch, getValues, setValue } = useForm({
        defaultValues: {
            content: "",
        }
    })
    const content = watch('content')

    useEffect(() => {
        if (postId) {
            postService.getPost(postId)
                .then((post) => {
                    setPost(post)
                    setIsAuthor(post && userData ? post?.owner?._id === userData?._id : false)
                    commentService.getAllComments(postId)
                        .then((comments) => {
                            dispatch(setComments(comments.docs))
                        })
                })
        }
        else {
            navigate('/')
        }
    }, [postId, navigate]);

    const deletePost = async () => {
        setDeletion(true)
        try {
            await postService.deletePost(post._id)
                .then(() => {
                    navigate('/')
                })
        } catch (error) {
            console.log('Error while deleting post')
        }
        setDeletion(false)
    };

    const createComment = async () => {
        setCommenting(true)
        try {
            await commentService.createComment(post._id, { content })
                .then(() => {
                    commentService.getAllComments(postId)
                        .then((comments) => {
                            dispatch(setComments(comments.docs))
                            setValue('content', '')
                            setCommentMSG('Comment added successfully')
                            setTimeout(() => {
                                setCommentMSG(null)
                            }, 3000)
                        })
                })
        } catch (error) {
            console.log('Error while commenting')
        }
        setCommenting(false)
    }

    const sortComments = (comments) => {
        const myComment = comments.filter((comment) => comment.owner[0]._id === userData._id).sort((a, b) => (new Date(b.createdAt) - new Date(a.createdAt)))
        const otherComments = comments.filter((comment) => comment.owner[0]._id !== userData._id).sort((a, b) => (new Date(b.createdAt) - new Date(a.createdAt)))
        return [...myComment, ...otherComments]
    }

    return post ? (
        <div className="py-8">
            {deletion ? <LoaderMSG message='Deleting your post..' /> : null}
            <div className="px-3 flex flex-wrap justify-between">
                <div className="w-full lg:w-[57%]">
                    <div className="w-full bg-white flex justify-center relative border rounded-t-xl p-2">
                        <img width={'500px'}
                            src={post.thumbnail}
                            alt={post.title}
                            className="rounded w-full"
                        />
                        {isAuthor && (
                            <div className="absolute right-6 top-6">
                                <Link to={`/edit-post/${post._id}`}>
                                    <Button bgColor="bg-green-500" className="mr-3" padding="px-3 py-2">
                                        Edit
                                    </Button>
                                </Link>
                                <Button bgColor="bg-red-500" onClick={deletePost} padding="px-3 py-2">
                                    Delete
                                </Button>
                            </div>
                        )}
                    </div>
                    <div className="w-full py-3 bg-sky-600">
                        <h1 className="text-2xl font-bold">{post.title}</h1>
                    </div>
                    <div className="text-left bg-gray-100 p-8 mb-8 rounded-b-xl">
                        <div className="mb-4">
                            <div className="flex flex-col align-left text-gray-800">
                                <p>{`Created By: ${post?.owner?.fullname} (@${post?.owner?.username})`}</p>
                            </div>
                            <p className="text-sm text-gray-600">{time}</p>
                        </div>
                        {parse(post.content)}
                    </div>
                </div>
                <div className="w-full lg:w-[40%]">
                    <div className="w-full py-2 bg-sky-600 rounded-t-xl">
                        <h1 className="text-2xl font-bold">Comments</h1>
                    </div>
                    <div className="text-left bg-white p-5 rounded-b-xl">
                        <div className="mb-8">
                            <div className="flex justify-between">
                                <p className="ml-1 mb-1 font-bold">Add Comment</p>
                                {
                                    commentMSG ? <p className="text-green-600 font-bold">{commentMSG}</p> : null
                                }
                            </div>
                            <RTE name="content" height={180} control={control} defaultValue={getValues("content")} />
                            <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full" padding="py-2 px-2 mt-2" onClick={createComment}>
                                {
                                    commenting ? <img width="27" className="mx-auto" src="../../assets/ButtonSpiner.gif" /> :
                                        "Comment"
                                }
                            </Button>
                        </div>
                        <p className="mb-3 font-bold">Comments</p>
                        {
                            comments.length == 0 ?
                                <p>No Comments on this posts</p> :
                                (sortComments(comments).map((comment) => (
                                    <CommentCard key={comment._id} comment={comment} />
                                )))
                        }
                    </div>
                </div>
            </div>
        </div>
    ) : <Loader/>;
}