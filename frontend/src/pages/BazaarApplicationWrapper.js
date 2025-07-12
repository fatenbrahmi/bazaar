import React from 'react'
import Navigation from '../components/Navigation/NavigationBar'
import { Outlet } from 'react-router-dom'



const BazaarApplicationWrapper = () => {

  return (
    <div>
        <Navigation />
        <Outlet />
        
    </div>
  )
}

export default BazaarApplicationWrapper