import React, { useState } from 'react'
import Form from '../form/Form'
import { useLocation } from 'react-router-dom'
import '../signup/Signup.css'

const UserUpdate = () => {
    const state = useLocation()
    const [data, setData] = useState(state.state)
    const handleSubmit = (updatedData)=> {
console.log('submit updatedData', updatedData)
    }
    console.log(data, 'updatedata')
  return (
    <div className='signupDiv'>
        <h2>User Update : </h2>
      <Form submitFunc={handleSubmit} formData={data} component='UPDATE' />
    </div>
  )
}

export default UserUpdate
