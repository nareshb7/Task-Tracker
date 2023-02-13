import React, { useEffect, useState, useContext } from 'react'
import { NavLink, } from 'react-router-dom'
import { UserContext } from '../../App'
import { setCookie } from '../cookieset/CookieComp'

const MyProfile = () => {
  const { currentUserVal, setCurrentUserVal } = useContext(UserContext)
  const [currentUser, setCurrentUser] = useState({})
  useEffect(() => {
    setCurrentUser(currentUserVal)
  }, [currentUserVal])

  const logoutFunc = () => {
    setCurrentUser({})
    setCurrentUserVal({})
    setCookie("63dab3b51d791ebc7821db51", 2)
  }
  const styles ={
    div: {
      display:'flex',
      justifyContent: 'center',
      alignItems:'center'
    },
    span : {
      color: '#888'
    }
  }

  return (
    <div>
      {
        Object.keys(currentUser).length > 2 ? <div style={styles.div}>
          <div>
            <h2>Name : {currentUser.fName} {currentUser.lName}  <span style={styles.span}>{currentUser.isAdmin && '( Admin )'}</span></h2>
            <h2>Email : {currentUser.email}</h2>
            <h2>Mobile : {currentUser.mobile}</h2>
            <h2>Password :{currentUser.password.slice(0, 2)}{''.padEnd(currentUser.password.length - 4, '*')}{currentUser.password.slice(-2)}</h2>
          </div>
          <div>
            <img src={currentUser.binaryData} alt='image' style={{ width: '200px', height: '200px' }} />
          </div>
          <div><button onClick={logoutFunc} style={{ padding: '10px 20px', border: 'none', margin: '10px', fontSize: '16px' }}>Logout</button></div>
        </div> : <h3>Please login to <NavLink to='/login'> click here </NavLink> </h3>
      }
    </div>
  )
}

export default MyProfile