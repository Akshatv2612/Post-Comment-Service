import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import store from './store/store.js'
import { Provider } from 'react-redux'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthLayout, EditPostLayout } from './components'
import { Addpost, EditPost, Home, Login, Post, SignUp, MyPosts} from './pages'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: (
          <AuthLayout authRequired={false}>
            <Login />
          </AuthLayout>
        )
      },
      {
        path: "/signup",
        element: (
          <AuthLayout authRequired={false}>
            <SignUp />
          </AuthLayout>
        ),
      },
      {
        path: '/add-post',
        element: (
          <AuthLayout>
            <Addpost />
          </AuthLayout>
        )
      },
      {
        path: '/edit-post/:postId',
        element: (
          <AuthLayout>
            <EditPostLayout>
              <EditPost />
            </EditPostLayout>
          </AuthLayout>
        )
      },
      {
        path: '/post/:postId',
        element: (
          <AuthLayout>
            <Post />
          </AuthLayout>
        )
      },
      {
        path: '/my-posts',
        element:(
          <AuthLayout>
            <MyPosts />
          </AuthLayout>
        )
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
)
