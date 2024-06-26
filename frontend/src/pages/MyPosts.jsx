import React, { useEffect, useState } from 'react'
import postService from '../services/post'
import { PostCard, Loader } from '../components'

function MyPosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setLoading(true)
        postService.getCurrentUserPosts()
            .then((posts) => {
                setPosts(posts)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    return (
        <div className='flex flex-col gap-2'>
            <div className='w-full mb-5'>
                <h1 className='m-4 mb-7 font-bold bg-sky-700 text-white p-4 rounded-lg'>My Posts</h1>
                {
                    loading ? <Loader /> : (
                        <div className='w-full px-3 flex flex-wrap'>
                            {
                                posts.map((post) =>
                                    <div key={post._id} className='p-2 lg:w-[290px] md:w-1/2'>
                                        <PostCard {...post} />
                                    </div>
                                )
                            }
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default MyPosts