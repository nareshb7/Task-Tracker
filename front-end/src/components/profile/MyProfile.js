import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { NavLink,useNavigate } from 'react-router-dom'
import { setCookie } from '../cookieset/CookieComp'

const MyProfile = ({currentUserVal, setCurrentUserVal}) => {
  const navigate = useNavigate()
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
  const reqAdminAccess =()=> {
    let cnfrm = window.confirm(`Are you eligible for Admin Access ?`)
        if (cnfrm) {
            axios.post('/api/adminupdateuser', { id: currentUser._id, "objectType": 'reqforAdmin', status: true, update:'single' })
                .then(res => console.log('applied for admin access'))
                .catch(err => console.log(err, 'err'))
        }
  }
  const updateData =(data)=> {
    navigate('/updateuser', {state: data})
  }
  return (
    <div>
      {
        Object.keys(currentUser).length > 2 ? 
        <div style={styles.div}>
          <div>
            <h2>Name : {currentUser.fName} {currentUser.lName}  <span style={styles.span}>{currentUser.isAdmin && '( Admin )'}</span></h2>
            <h2>Email : {currentUser.email}</h2>
            <h2>Mobile : {currentUser.mobile}</h2>
            <h2>Password :{currentUser.password.slice(0, 2)}{''.padEnd(currentUser.password.length - 4, '*')}{currentUser.password.slice(-2)}</h2>
          </div>
          <div>
            <img src={currentUser.binaryData} alt='image' style={{ width: '200px', height: '200px' }} />
          </div>
          <div>
            <p style={{ display: `${currentUser.isAdmin ? 'none': 'block'}`}}>Request  {currentUser.reqforAdmin ? 'sent ':'for '}  <button disabled={currentUser.reqforAdmin}  onClick={reqAdminAccess}>Admin access</button></p>
            <div>
              <button onClick={logoutFunc} style={{ padding: '10px 20px', border: 'none', margin: '10px', fontSize: '16px' }}>Logout</button>
              <button onClick={()=> updateData(currentUser)}>Update Details</button>
            </div>
          </div>
        </div> : <h3>Please login to <NavLink to='/login'> click here </NavLink> </h3>
      }
    </div>
  )
}

export default MyProfile