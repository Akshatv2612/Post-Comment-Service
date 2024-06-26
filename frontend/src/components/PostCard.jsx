import { Link } from 'react-router-dom'
import timeAgo from '../utils/timeInterval'


function PostCard({ _id, title,createdAt, content, thumbnail, owner }) {
    const time=timeAgo(createdAt)

    return (
        <Link to={`/post/${_id}`}>
            <div className='w-full flex flex-col justify-between items-center bg-white rounded-xl p-4'>
                <div className='w-full flex justify-center mb-4'>
                    <img src={thumbnail} alt={title}
                        className='rounded-xl max-w-[100]' />
                </div>
                <div className="mb-4">
                    <div className="flex flex-col align-left text-gray-800">
                        <p>{`Created By: ${owner[0]?.fullname} (@${owner[0]?.username})`}</p>
                    </div>
                    <p className="text-sm text-gray-600">{time}</p>
                </div>
                <h2
                    className='text-xl font-bold'
                >{title}</h2>
            </div>
        </Link>
    )
}

export default PostCard