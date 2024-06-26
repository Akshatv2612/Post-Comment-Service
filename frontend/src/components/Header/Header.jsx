import React from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Container from '../container/container'
import LogoutBtn from './LogoutBtn'

function Header() {
  const navigate = useNavigate()
  const isLoggedIn = useSelector(state => state.auth.isloggedIn)

  const navItems = [
    {
      name: 'Home',
      path: '/',
      active: true
    },
    {
      name: 'Add Post',
      path: '/add-post',
      active: isLoggedIn
    },
    {
      name:'MyPosts',
      path:'/my-posts',
      active: isLoggedIn
    },
    {
      name: 'Login',
      path: '/login',
      active: !isLoggedIn
    },
    {
      name: 'Sign Up',
      path: '/signup',
      active: !isLoggedIn
    },
  ]

  return (
    <header className='py-3 bg-sky-900 shadow rounded-sm'>
      <Container>
        <nav className='flex justify-between'>
          <div className='flex items-center'>
          </div>
          <ul className='flex text-white gap-3'>
            {navItems.map((item) => item.active && (
              <li key={item.name}>
                <button onClick={() => { navigate(item.path) }} className='inline-bock px-2 py-1 sm:px-6 sm:py-2 duration-200 hover:bg-blue-100 hover:text-black rounded-full'>
                  {item.name}
                </button>
              </li>
            ))}

            {isLoggedIn && (
              <li>
                <LogoutBtn />
              </li>
            )}
          </ul>
        </nav>
      </Container>
    </header>
  )
}

export default Header