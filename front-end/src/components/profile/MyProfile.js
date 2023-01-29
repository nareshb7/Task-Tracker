import React, { useEffect, useState } from 'react'
import axios from 'axios'

const MyProfile = () => {
  const [currentUse, setCurrentUser] = useState({})
  useEffect(() => {
    axios.get('/getCurrentUser', {
      headers: {
        "Content-Type" : "application/json"
      }
    })
    .then(data => setCurrentUser(data.data[0]))
    .catch(err => console.log(err, 'err profile'))
  }, [])
  if (!currentUse) {
    return <h1>No user logged in</h1>
  }
  const {currentUser} =currentUse
  console.log(currentUser, 'curentuser')
  // const base64String =currentUser && btoa(String.fromCharCode(...new Uint8Array(currentUser.profileImage.data.data)))
  // const base64String =currentUser && window.btoa(encodeURIComponent(currentUser.profileImage.data.data));
  const text =''
  return (
    <div>
      {
        currentUser && <div>
          <h2>Name : {currentUser.uName}</h2>
          <h2>Email : {currentUser.email}</h2>
          <h2>Mobile : {currentUser.mobile}</h2>
          <h2>Password :{currentUser.password.slice(0,2)}{text.padEnd(currentUser.password.length -4,'*')}{currentUser.password.slice(-2)}</h2>
          <div>
            <img src={`/users/${currentUser.profileImage}`} alt='image' style={{width:'200px', height:'200px'}} />
          </div>
        </div>
      }

    </div>
  )
}

export default MyProfile