import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Signup.css'
import Form from '../form/Form'

const Signup = () => {
    
    const [response, setResponse] = useState('')
    const [errors, setErrors] = useState({})
    const [isSubmitted, setIsSubmitted] = useState(false)
    const addUser =(creds)=> {
        axios.post('/api/signupData', { data: creds}, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
            .then(res => setResponse(res.data))
            .catch(err => setResponse(JSON.stringify(err)))
    }
    const verifyData =async (checkdata)=> {
        console.log('start')
        let result = ''
        let res = await axios.get('/api/getallusers')
        let isValid = await res.data.filter(val => val.email === checkdata.email || val.mobile.toString() === checkdata.mobile)
        console.log(isValid, 'isValid')
        if (isValid.length) {
            if (isValid[0].email === checkdata.email){
                setErrors({...errors, "email": 'Try new Email Id.'})
            } else {
                setErrors({...errors, 'mobile': 'Try new Mobile number...'})
            }
            setResponse('Something Went Wrong')
            result = 'error red'
        } else {
            if (checkdata.isAdmin === false) {
                addUser(checkdata)
                setIsSubmitted(true)
                console.log('userAccount created sucessfully')
            }
            result = 'newemailid'
        }
        return result

    }
   // useEffect(()=> {
        //     if(otp){
        //         setTimeout(()=> {
        //             let random = window.prompt('Enter the Email verification code here : ')
        //             console.log(random, 'random', otp)
        //             if(random == otp){
        //                 addUser(data)
        //             }
        //             setOtp('')
        //         },1000)
        //     }
        // },[otp])
        // const adminAcVerify =(creds)=>{
        //     axios.post('/api/mailverification',{creds})
        //     .then(data => {
        //         setResponse(data.data.message)
        //         setOtp(data.data.psd)
        //     })
        //     .catch(err => console.log(err,'creds err'))
        //     setResponse('verification code is sending to your mail...')
        // }
    const handleSubmit = (submitedData) => {
        const d = new Date().toLocaleString()
        submitedData['joinedDate'] = d
       // const response = verifyData(submitedData)
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