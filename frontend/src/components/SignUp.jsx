import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import authService from '../services/auth.js'
import { useDispatch } from 'react-redux'
import { logIn } from '../slices/authSlice.js'
import { useNavigate } from 'react-router-dom'
import { Input, Button} from './index.js'
import { Link } from 'react-router-dom'
import { LoaderMSG } from '../components'
import { useCookies } from "react-cookie";


function SignUp() {
    const [cookies, setCookie, removeCookie] = useCookies(["user"]);
    const { register, handleSubmit } = useForm()
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onSubmitHandler = async (data) => {
        setSubmitting(true)
        setError('')
        try {
            const response = await authService.register(data.fullname, data.username, data.email, data.password)
            if (response.statusCode == 200) {
                setCookie('accessToken', response.data.accessToken, { path: '/' })
                setCookie('refreshToken', response.data.refreshToken, { path: '/' })
                const user = await authService.getCurrentUser()
                if (user) {
                    dispatch(logIn(user.data))
                    navigate('/')
                }
            } else {
                setError(response.message)
            }
        } catch (error) {
            setError(error.message)
        }
        setSubmitting(false)
    }

    return (
        <div className="flex items-center justify-center">
            {submitting ? <LoaderMSG message='Registering..' /> : null}
            <div className={`mx-auto w-full max-w-lg bg-sky-700 rounded-xl p-10 border border-black/10`}>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-primary transition-all duration-200 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}

                <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className='space-y-5'>
                        <Input
                            label="Full Name: "
                            placeholder="Enter your full name"
                            {...register("fullname", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Username: "
                            placeholder="Enter username"
                            {...register("username", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Password: "
                            type="password"
                            placeholder="Enter your password"
                            {...register("password", {
                                required: true,
                            })}
                        />
                        <Button type="submit" className="w-full" bgColor='bg-sky-900'>
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default SignUp