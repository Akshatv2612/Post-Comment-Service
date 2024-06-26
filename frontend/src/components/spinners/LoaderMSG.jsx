import React from 'react'

function LoaderMSG({ message="" }) {
    return (
        <div className='bg-white h-screen w-full top-0 left-0 fixed z-10 opacity-70 flex flex-col items-center justify-center'>
            <img src='../../assets/spinner.gif'></img>
            <h1 className='text-black text-xl'>{message}</h1>
        </div>
    )
}

export default LoaderMSG