// import React from 'react'
import { Link } from 'react-router-dom'

function PageNotFound() {
  return (
    <div>
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <div>
        <button style={{color:'white',background:'red'}}><Link style={{color:'white'}} to={'/'}>Go to Home page</Link></button>
      </div>
    </div>
  )
}

export default PageNotFound