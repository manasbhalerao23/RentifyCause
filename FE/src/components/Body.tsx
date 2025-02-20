import React from 'react'
import Header from './Header'
import { Outlet } from 'react-router-dom'

export const Body = () => {
  return (
    <div>
        <Header/>
        <div className='relative'>
            <Outlet/>
        </div>
        
        <div className="bottom-0 relative">
          {/* <Footer /> */}
        </div>
    </div>
  )
}


export default Body;