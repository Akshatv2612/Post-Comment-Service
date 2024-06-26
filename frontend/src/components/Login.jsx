import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch } from 'react-redux'
import authService from '../services/auth'
import { logIn } from '../slices/authSlice'
import { useNavigate } from 'react-router-dom'
import { Input, Button} from './index.js'
import { Link } from 'react-router-dom'
import LoadingMSG from './spinners/LoaderMSG.jsx'
import { useCookies } from 'react-cookie'

function Login() {
    const { register, handleSubmit } = useForm()
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);

    const onSubmitHandler = async (data) => {
        setSubmitting(true)
        setError('')
        try {
            const response = await authService.login(data.email, data.password)
            if (response.success==true) {
                setCookie('accessToken', response.data.accessToken, { path: '/' })
                setCookie('refreshToken', response.data.refreshToken, { path: '/' })
                const user = await authService.getCurrentUser()
                if (user) {
                    dispatch(logIn(user))
                    navigate('/')
                }
            }else{
                setError(response.message)
            }
        } catch (error) {
            setError(error)
        }
        setSubmitting(false)
    }

    return (
        <div
            className='flex items-center justify-center w-full'
        >
            {submitting ? <LoadingMSG message='Signing In' /> : null}
            <div className={`mx-auto w-full max-w-lg bg-sky-700 rounded-xl p-10 border border-black/10`}>
                <div className="mb-2 flex justify-center">
                    <span className="inline-block w-full max-w-[100px]">
                    </span>
                </div>
                <h2 className="text-center text-2xl font-bold leading-tight">Login in to your account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Log In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">Error while login: {`${error}`}</p>}
                <form onSubmit={handleSubmit(onSubmitHandler)} className='mt-8'>
                    <div className='space-y-5'>
                        <Input
                            label='Email: '
                            type='email'
                            placeholder='Enter your email'
                            {...register("email", {
                                required: true,
                            })}
                        />
                        <Input
                            label='Password: '
                            type='password'
                            placeholder='Enter your password'
                            {...register("password", {
                                required: true,
                            })}
                        />
                        <Button
                            type='submit'
                            className='w-full'
                            bgColor='bg-sky-900'
                        >Sign In</Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login