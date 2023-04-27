import React, { useState, useContext } from 'react'
import SignupForm from '../registration/Form'
import { useLocation, useNavigate } from 'react-router-dom'
// import '../registration/Signup.css'
import { UserContext } from '../../App'
import { fetchCall } from '../utils/fetch/UseFetch'
import { Row } from 'react-bootstrap'

const UserUpdate = () => {
    const state = useLocation()
    const navigate = useNavigate()
    const {setCurrentUserVal} = useContext(UserContext)
    const [data, setData] = useState(state.state)
    const [response,setResponse] = useState('')

    const successFunc =(res)=> {
      setResponse('User Data Updated Sucessfully, Navigating to profile page')
      setCurrentUserVal(res)
      setTimeout(()=> {
        navigate('/login')
      },2000)
    }
    const handleSubmit =async (updatedData)=> {
      setResponse('Submitting....')
      const apiResponse = await fetchCall('api/adminupdateuser', {id :updatedData._id ,updateValue: updatedData, update: 'MULTIPLE'} )
      if(apiResponse._id) {
        successFunc(apiResponse)
      }else {
        setResponse('Error Occured')
      }
    }

  return (
    
      <Row>
        <h2>User Update : </h2>
      <SignupForm submitFunc={handleSubmit} formData={data} component='UPDATE' />
      <div>
        <h3>Status : {response}</h3>
      </div>
      </Row>
  )
}

export default UserUpdate
