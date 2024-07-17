import { useState } from 'react'
import toast,{Toaster} from 'react-hot-toast'
import { Outlet } from 'react-router'
import './App.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Toaster/>
    <main>
    <Outlet/>
    </main>
      
    </>
  )
}

export default App
