import React, { useEffect, useState } from 'react'
import postService from "../services/post";
import { Container, PostCard, Loader } from '../components'
import { useSelector } from 'react-redux';

function Home() {
    const [posts, setPosts] = useState([])
    const [loader, setLoader] = useState(true)
    const isLoggedIn = useSelector(state => state.auth.isloggedIn)
    const userData = useSelector(state => state.auth.userData)

    useEffect(() => {
        postService.getPosts().then((posts) => {
            if (posts) {
                setPosts(posts)
            }
            setLoader(false)
        }).catch((error) => {
            setLoader(false)
        })

    }, [])

    if (loader) {
        return (
            <Loader />
        )
    }
    else {
        if (!isLoggedIn) {
            return (
                <div className="w-full py-8 mt-4 text-center">
                    <Container>
                        <div className="flex flex-wrap">
                            <div className="p-2 w-full">
                                <h1 className="text-2xl font-bold hover:text-gray-500">
                                    Login to read posts
                                </h1>
                            </div>
                        </div>
                    </Container>
                </div>
            )
        }
        else return (
            <div className='w-full py-8'>
                <Container>
                    <div className='flex flex-wrap justify-between'>
                        {posts.length !== 0 ?
                            posts.map((post) => (
                                <div key={post._id} className='p-2 lg:w-[290px] md:w-1/2'>
                                    <PostCard {...post} />
                                </div>
                            )) :
                            <div className="w-full py-8 mt-4 text-center">
                                <div className="flex flex-wrap">
                                    <div className="p-2 w-full">
                                        <h1 className="text-2xl font-bold hover:text-gray-500">
                                            No Posts at this moment
                                        </h1>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </Container>
            </div>
        )
    }
}

export default Home