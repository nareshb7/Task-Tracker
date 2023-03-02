import React, { useState, useContext } from 'react'
import axios from 'axios'
import SignupForm from '../registration/Form'
import { useLocation, useNavigate } from 'react-router-dom'
import '../registration/Signup.css'
import { UserContext } from '../../App'

const UserUpdate = () => {
    const state = useLocation()
    const navigate = useNavigate()
    const {setCurrentUserVal} = useContext(UserContext)
    const [data, setData] = useState(state.state)
    const [response,setResponse] = useState('')

    const success =(res)=> {
      setResponse('User Data Updated Sucessfully, Navigating to profile page')
      setCurrentUserVal(res)
      setTimeout(()=> {
        navigate('/login')
      },2000)
    }
    const handleSubmit = (updatedData)=> {
      setResponse('Submitting....')
      axios.post('api/adminupdateuser', {id :updatedData._id ,updateValue: updatedData, update: 'MULTIPLE'})
      .then(res => success(res.data))
      .catch(err => setResponse('Error Occured '))
    }

  return (
    <div className='signupDiv'>
        <h2>User Update : </h2>
      <SignupForm submitFunc={handleSubmit} formData={data} component='UPDATE' />
      <div>
        <h3>Status : {response}</h3>
      </div>
    </div>
  )
}

export default UserUpdate
