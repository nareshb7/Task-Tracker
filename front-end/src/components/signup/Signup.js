import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Signup.css'
import Form from '../form/Form'
import { useLocation, useNavigate } from 'react-router-dom'

const Signup = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const [response, setResponse] = useState('')
    const [errors, setErrors] = useState({})
    const [isSubmitted, setIsSubmitted] = useState(false)
    useEffect(()=> {
        if (location.state?.status== 'Success'){
            addUser(location.state.data)
            setResponse('Creating ur account...')
            console.log(location.state.data, 'returned data use')
        }
        
    },[location.state])
    
    const addUser =(creds)=> {
        axios.post('/api/signupData', { data: creds}, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
            .then(res => {
                setResponse(res.data)
                setIsSubmitted(true)
            })
            .catch(err => setResponse(JSON.stringify(err)))
    }   

    const verifyData =async (checkdata)=> {
        let res = await axios.get('/api/getallusers')
        let isValid = await res.data.filter(val => val.email === checkdata.email || val.mobile.toString() === checkdata.mobile)
        if (isValid.length) {
            if (isValid[0].email === checkdata.email){
                setErrors({...errors, "email": 'Try new Email Id.'})
            } else {
                setErrors({...errors, 'mobile': 'Try new Mobile number...'})
            }
            setResponse('Something Went Wrong')
        } else {
            if (checkdata.isAdmin === false) {
                navigate('/verifymail/signup', {state: checkdata})
                console.log(checkdata, 'data verified')
            }
        }
    }
       
    const handleSubmit = (submitedData) => {
        const d = new Date()
        submitedData['joinedDate'] = d
        verifyData(submitedData)
        console.log(submitedData, 'signindata', response)
        setResponse('Submitting...')
    }
    return (
        <div className='signupDiv'>
            <Form submitFunc={handleSubmit} error={errors} isSubmitted={isSubmitted}/>
            <div><h3>Status : {response}</h3></div>            
        </div>
    )
}

export default Signup