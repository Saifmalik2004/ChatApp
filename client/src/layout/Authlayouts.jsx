import React from 'react'
import logo from "../assets/Screenshot 2024-07-14 104856.png"

function AuthLayouts({children}) {
  return (
    <>
    <div> 
      <header className='flex justify-center items-center py-3 h-20 shadow-md bg-white'>
        <img src={logo}
        alt='"logo'
        width={180}
        height={60}
        />
        </header>
    </div>
    {children}
    </>
  )
}

export default AuthLayouts