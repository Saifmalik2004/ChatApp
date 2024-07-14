import React from 'react'
import { Outlet } from 'react-router'

function Home() {
  return (
    <div>
      Home
      {/* {messgae component} */}
      <section>
        <Outlet/>
      </section>
    </div>
  )
}

export default Home
