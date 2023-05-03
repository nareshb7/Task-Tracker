import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SignupForm from '../components/registration/Form'
import { UserContext } from '../App'
import { setCookie } from '../components/utils/CookieComp'
import './style/Signup.css'
import { Col, Row } from 'react-bootstrap'

const Signup = () => {
    const navigate = useNavigate()
    const { setCurrentUserVal, socket } = useContext(UserContext)
    const location = useLocation()
    const [response, setResponse] = useState('')
    const [errors, setErrors] = useState({})
    const [isSubmitted, setIsSubmitted] = useState(false)
    useEffect(() => {
        if (location.state?.status === 'Success') {
            addUser(location.state.data)
            setResponse('Creating ur account...')
        }

    }, [location.state])

    const addUser = (creds) => {
        axios.post('/api/signupData', { data: creds })
            .then(res => {
                // setResponse(res.data)
                setIsSubmitted(true)
                setCurrentUserVal(res.data)
                setCookie(res.data._id, 2)
                socket.emit('new-user')
                navigate('/login')
            })
            .catch(err => {
                let val = ''
                if(err.response.data.keyValue?.mobile) {
                    val ='Mobile'
                    setErrors({ ...errors, 'mobile': 'Try new Mobile number...' })
                }
                if (err.response.data.keyValue?.email) {
                    val = 'Email'
                    setErrors({ ...errors, "email": 'Try new Email Id.' })
                }
                setResponse(`Check the ${val} field`)
            })
    }

    const verifyData = async (checkdata) => {
        let res = await axios.get('/api/getallusers')
        let isValid = await res.data.find(val => val.email === checkdata.email || val.mobile.toString() === checkdata.mobile)
        if (isValid) {
            let val = ''
            if (isValid.email === checkdata.email) {
                val = 'email'
                setErrors({ ...errors, "email": 'Try new Email Id.' })
            } else {
                val = 'mobile'
                setErrors({ ...errors, 'mobile': 'Try new Mobile number...' })
            }
            setResponse(`Check the ${val} field`)
        } else {
            if (checkdata.isAdmin === false) {
                navigate('/verifymail/signup', { state: checkdata })
            }
        }
    }
    const nameFormat =(data)=> {
        const d = new Date()
        let {fName, lName} = data
        data.fName = fName.slice(0,1).toUpperCase() + fName.slice(1)
        data.lName = lName.slice(0,1).toUpperCase() + lName.slice(1)
        data['joinedDate'] = d
        return data
    }
    const handleSubmit = (submitedData) => {
        const updatedData = nameFormat(submitedData)
         verifyData(updatedData)
        setResponse('Submitting...')
    }
    return (
        <Row className='card py-2 signup-main'>
            <Col md={10} className='card m-auto'>
            <SignupForm submitFunc={handleSubmit} error={errors} isSubmitted={isSubmitted} />
            <Col className=' py-4'>
                <p className='text-center'>
                    Already have an account ? <Link to='/login'>Login</Link>
                </p>
            </Col>
            </Col>
            <Col md={10} className='card my-1 m-auto'><h3>Status : {response}</h3></Col>
        </Row>
    )
}

export default Signup