import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import postService from '../../services/post'

function EditPostLayout({ children }) {
    const navigate = useNavigate()
    const { postId } = useParams()
    const user = useSelector(state => state.auth.userData)

    useEffect(() => {
        postService.getPost(postId)
            .then((post) => {
                if (post.owner._id !== user._id) {
                    navigate('/')
                }
            })
            .catch(() => {
                navigate('/')
            })
    }, [postId])

    return (
        <div>{children}</div>
    )
}

export default EditPostLayout