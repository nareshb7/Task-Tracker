import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import './Signup.css'
import SignupForm from './Form'
import { useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from '../../App'
import { setCookie } from '../utils/CookieComp'

const Signup = () => {
    const navigate = useNavigate()
    const {setCurrentUserVal, socket} = useContext(UserContext)
    const location = useLocation()
    const [response, setResponse] = useState('')
    const [errors, setErrors] = useState({})
    const [isSubmitted, setIsSubmitted] = useState(false)
    useEffect(()=> {
        if (location.state?.status=== 'Success'){
            addUser(location.state.data)
            setResponse('Creating ur account...')
        }
        
    },[location.state])
    
    const addUser =(creds)=> {
        axios.post('/api/signupData', { data: creds})
            .then(res => {
                // setResponse(res.data)
                setIsSubmitted(true)
                setCurrentUserVal(res.data)
                setCookie(res.data._id, 2)
                socket.emit('new-user')
                navigate('/login')
            })
            .catch(err => setResponse(JSON.stringify(err)))
    }   

    const verifyData =async (checkdata)=> {
        let res = await axios.get('/api/getallusers')
        let isValid = await res.data.filter(val => val.email === checkdata.email || val.mobile.toString() === checkdata.mobile)
        if (isValid.length) {
            let val=''
            if (isValid[0].email === checkdata.email){
                val='email'
                setErrors({...errors, "email": 'Try new Email Id.'})
            } else {
                val='mobile'
                setErrors({...errors, 'mobile': 'Try new Mobile number...'})
            }
            setResponse(`Check the ${val} field`)
        } else {
            if (checkdata.isAdmin === false) {
                navigate('/verifymail/signup', {state: checkdata})
            }
        }
    }
       
    const handleSubmit = (submitedData) => {
        const d = new Date()
        submitedData['joinedDate'] = d
        verifyData(submitedData)
        setResponse('Submitting...')
    }
    return (
        <div className='signupDiv'>
            <SignupForm submitFunc={handleSubmit} error={errors} isSubmitted={isSubmitted}/>
            <div><h3>Status : {response}</h3></div>            
        </div>
    )
}

export default Signup