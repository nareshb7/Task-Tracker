import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'

import useAuth from '../authentication/Authentication'
import { setCookie } from '../cookieset/CookieComp'

const MyProfile = () => {
  const user = useAuth()
  const [currentUser, setCurrentUser] = useState({})
  useEffect(()=> {
    setCurrentUser(user)
  },[user])
  if (!currentUser.hasOwnProperty('fName')) {
    return (
      <div>
        <h2>No user logged in </h2>
        <div>Click here to <NavLink to='/login' >Login</NavLink></div>
      </div>
    )
  }
  const text =''
  const logoutFunc =()=> {
    setCurrentUser({})
    setCookie("63dab3b51d791ebc7821db51",2)
  }
  return (
    <div>
      {
        currentUser && <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
          <div>
          <h2>Name : {currentUser.fName} {currentUser.lName}</h2>
          <h2>Email : {currentUser.email}</h2>
          <h2>Mobile : {currentUser.mobile}</h2>
          <h2>Password :{currentUser.password.slice(0,2)}{text.padEnd(currentUser.password.length -4,'*')}{currentUser.password.slice(-2)}</h2>
        </div>
        <div>
        <img src={currentUser.binaryData} alt='image' style={{width:'200px', height:'200px'}} />
      </div>
        <div><button onClick={logoutFunc} style={{padding:'10px 20px', border:'none', margin:'10px', fontSize:'16px'}}>Logout</button></div>
      </div>
      }
    </div>
  )
}

export default MyProfile