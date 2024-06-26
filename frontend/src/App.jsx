import './App.css'
import { useState, useEffect } from 'react'
import authService from './services/auth'
import { useDispatch} from 'react-redux'
import { Outlet } from 'react-router-dom'
import { logIn, logOut } from './slices/authSlice'
import { Header, Footer } from './components' 

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
      .then((user) => {
        if (user) {
          dispatch(logIn(user))
        }
        else {
          dispatch(logOut())
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between p-1 bg-sky-200'>
      <div className='w-full block'>
        <Header />
        <main>
        <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : (
    <div>Loading...</div>
  )
}

export default App
