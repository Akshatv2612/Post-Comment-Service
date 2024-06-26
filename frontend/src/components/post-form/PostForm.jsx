import React, { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Select, RTE } from '../index.js'
import postService from '../../services/post.js'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoadingMSG from '../spinners/LoaderMSG.jsx'

function PostForm({ post }) {
    const { register, handleSubmit, watch, control, setValue, getValues } = useForm({
        defaultValues: {
            title: post?.title || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const [submitting, setSubmitting] = useState(false)
    const navigate = useNavigate();
    const userData = useSelector(state => state.auth.userData)
    const content = watch('content')

    const submit = async (data) => {
        setSubmitting(true)
        if (post) {
            const Post = await postService.updatePost(post._id, { ...data})

            if (Post) {
                navigate(`/post/${Post._id}`)
            }
        } else {
            const Post = await postService.createPost({ ...data })
            if (Post) {
                navigate(`/post/${Post._id}`)
            }
        }
        setSubmitting(false)
    };

    return (
        <div>
            {submitting ? <LoadingMSG message='Saving Post' /> : null}
            <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
                <div className="w-2/3 px-2">
                    <Input
                        label="Title :"
                        placeholder="Title"
                        className="mb-4"
                        {...register("title", { required: true })}
                    />
                    <RTE label="Content :" name="content" control={control} defaultValue={content} />
                </div>
                <div className="w-1/3 px-2">
                    <Input
                        label="Featured Image :"
                        type="file"
                        className="mb-4"
                        accept="image/png, image/jpg, image/jpeg, image/gif"
                        {...register("thumbnail", { required: !post })}
                    />
                    {post && (
                        <div className="w-full mb-4">
                            <p className='mt-1'>Old Thumbnail:</p>
                            <img
                                src={post.thumbnail}
                                alt={post.title}
                                className="rounded-lg"
                            />
                        </div>
                    )}
                    <Select
                        options={["active", "inactive"]}
                        label="Status"
                        className="mb-4"
                        {...register("status", { required: true })}
                    />
                    <Button type="submit" bgColor={post ? "bg-green-500" : "bg-sky-700"} padding='py-3' className="w-full">
                        {post ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default PostForm