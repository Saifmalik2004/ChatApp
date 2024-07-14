import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import Register from './pages/Register.jsx'
import CheckPassword from './pages/CheckPassword'
import CheckEmail from './pages/CheckEmail'
import Home from './pages/Home'
import MessagesPage from './components/MessagesPage.jsx'
import { RouterProvider,createBrowserRouter } from 'react-router-dom'
import AuthLayouts from './layout/Authlayouts.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
 



const  router = createBrowserRouter([
    {
      path: "/",
      element: <App/>,
      children: [
          {
              path: "register",
              element:<AuthLayouts><Register/></AuthLayouts> 
          },
          {
              path: "/email",
              element: (
                <AuthLayouts><CheckEmail/></AuthLayouts>
                  
              ),
          },
          {
              path: "/password",
              element: (
                <AuthLayouts><CheckPassword/></AuthLayouts>
                  
              ),
          },
          {
           path:"/forgot-password",
           element: (
            <AuthLayouts><ForgotPassword/></AuthLayouts>
              
          )
          },
          {
              path: "",
              element: <Home/>,
              children:[
                {
                    path:':userid',
                    element:<MessagesPage/>
                }
              ]

              
          }
          
          
          
      ],
  },
  ])
 
  

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
    <RouterProvider router={router}>
    <App/>
    </RouterProvider>
    
  </React.StrictMode>,
)
