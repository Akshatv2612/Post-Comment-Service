import React, { useState } from 'react'
import timeAgo from '../utils/timeInterval'
import Button from './Button'
import RTE from './RTE'
import { useForm } from 'react-hook-form'
import commentService from '../services/comment'
import { useDispatch, useSelector } from 'react-redux'
import { setComments, addComment, deleteComment } from '../slices/commentSlice'
import parse from 'html-react-parser'

function CommentCard({ comment }) {
    const time = timeAgo(comment.createdAt)
    const { control, watch, getValues } = useForm({
        defaultValues: {
            content: comment?.content || "",
        }
    })
    const [editOn, setEditOn] = useState(false)
    const [editLoading, setEditLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const comments = useSelector((state) => state.comment.comments)
    const userData = useSelector((state) => state.auth.userData)
    const dispatch = useDispatch()
    const content = watch('content')
    const isAuthor = comment && userData ? comment?.owner[0]?._id === userData?._id : false;

    const editToggleHandler = () => {
        setEditOn(!editOn)
    }

    const editHandler = () => {
        setEditLoading(true)
        commentService.updateComment(comment._id, { content })
            .then((res) => {
                const newComments = comments.map((c) => {
                    if (c._id === comment._id) {
                        return { ...c, content }
                    }
                    return c
                })
                dispatch(setComments(newComments))
            })
            .finally(() => {
                setEditLoading(false)
                setEditOn(false)
            })
    }

    const deleteHandler = () => {
        setDeleteLoading(true)
        commentService.deleteComment(comment._id)
            .then((res) => {
                dispatch(deleteComment(comment._id))
            })
            .finally(() => {
                setDeleteLoading(false)
            })
    }

    return (
        <div>
            <div className="flex gap-x-4">
                <div className="relative w-full">
                    {isAuthor && (
                        <div className="flex absolute right-6">
                            <Button bgColor="bg-green-500" className="mr-3 h-full" padding="px-2 py-1" onClick={editOn ? editHandler : editToggleHandler}>
                                {editOn ? 'Save' : 'Edit'}
                            </Button>
                            <Button bgColor="bg-red-500" className='h-full' padding='px-2 py-1' onClick={deleteHandler}>
                                Delete
                            </Button>
                        </div>
                    )}
                    <div className="mb-4 text-sm">
                        <div className="flex flex-col align-left text-gray-800">
                            <p>{`${comment?.owner[0]?.fullname} (@${comment?.owner[0]?.username})`}</p>
                        </div>
                        <p className="text-sm text-gray-600">{time}</p>
                    </div>
                    {
                        editOn ?
                            <RTE name="content" height={180} control={control} defaultValue={getValues("content")} /> :
                            <div className="mt-3 p-3 rounded-md border-gray-100 border-2 text-sm">{parse(comment.content)}</div>
                    }
                    <div className='bg-sky-200 h-[1px] w-full mt-3'></div>
                </div>
            </div>
            <hr className="my-4 border-white" />
        </div>
    )
}

export default CommentCard