import axios from 'axios'
import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { fetchCall } from '../utils/fetch/UseFetch'
import { psdPattern } from '../utils/Constants'
import { Link, useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
    const navigate = useNavigate()
    const [searchIpt, setSearchIpt] = useState('')
    const [data, setData] = useState({})
    const [response, setResponse] = useState('')
    const [userOtp, setUserOtp] = useState('')
    const [otp, setOtp] = useState(false)
    const [newPsd, setNewpsd] = useState({
        psd: '',
        conPsd: ''
    })
    const [isValid, setIsValid] = useState(false)
    const [isReady, setIsReady] = useState(false)

    const handleClick = () => {
        axios.get('/api/getallusers')
            .then(async data => {
                let res = data.data.find(val => val.mobile == searchIpt || val.email == searchIpt)
                if (res) {
                    setData(res)
                    setResponse('Data found, OTP sending to ur mail...')
                    let otp = await fetchCall('api/mailverification', { apiPayload: res.email })
                    console.log('OTP', otp)
                    setResponse(otp.message)
                    setOtp(otp.psd)
                    setIsValid(false)
                    setIsReady(false)
                } else {
                    setResponse('No details found')
                    setData({})
                }
            })
            .catch(err => console.log(err))
        setResponse('Checking the database...')
        setUserOtp('')
        setOtp(false)

    }
    const handleOtpCheck = () => {
        let res = otp == userOtp
        console.log('res', res)
        if (res) {
            setResponse('')
            setIsValid(true)
            setOtp('')
        } else {
            setResponse('OTP not matching')
            setIsValid(false)
        }
    }
    const handlePasswordChange = (e) => {
        setNewpsd({ ...newPsd, [e.target.name]: e.target.value })
    }
    const passwordChangeFunc = async () => {
        if (newPsd.psd == data.password) {
            setResponse('Ur old password is same as the new password , please check')
            return 
        }
        setResponse('Updating...')
        const res = await fetchCall('api/adminupdateuser', { id: data._id, updateKey: 'password', updateValue: newPsd.psd })
        setResponse(`Successfully Changed`)
        console.log('Passsowrd', res)
        setNewpsd({psd:'', conPsd:''})
        setIsValid(false)
        setIsReady(true)
        // navigate('/login')
    }
    const handlePasswordSubmit = async (e) => {
        e.preventDefault()
        console.log('Password', newPsd)
        if (newPsd.psd.match(psdPattern)) {
            newPsd.psd == newPsd.conPsd ?
                await passwordChangeFunc() :
                setResponse('Confirm password not matching')

        } else {
            setResponse('Require min 8 chars including one digit, one character, alphabet')
        }
    }
    return (
        <Row className='card m-auto p-1'>
            <Row md={7}>
                <Col>
                    <input className='form-control' type='text' name='mobile' value={searchIpt} onChange={(e) => setSearchIpt(e.target.value)} placeholder='Enter email or mobile' />
                    <Button onClick={handleClick}>Search</Button>
                </Col>
            </Row>
            <Row><h5>Status : {response}</h5></Row>
            {
                data.hasOwnProperty('mobile') && <Row>
                    {
                        otp && <Row className='my-2'>
                            <Col>
                                <input className='form-control my-1' type='text' name='userOtp' value={userOtp} onChange={(e) => setUserOtp(e.target.value)} placeholder='Enter your otp here...' />
                                <Button onClick={handleOtpCheck}>Check </Button>
                            </Col>
                        </Row>
                    }
                    {
                        isValid && <Form className='my-2' onSubmit={handlePasswordSubmit}>
                            <Form.Control className='my-1' type='password' value={newPsd.psd} name='psd' placeholder='Enter new Password' onChange={handlePasswordChange} required />
                            <Form.Control className='my-1' type='password' value={newPsd.conPsd} name='conPsd' placeholder='Confirm Password' onChange={handlePasswordChange} required/>
                            <Button type='submit' >Submit</Button>
                        </Form>
                    } 
                    {
                        isReady && <Col>
                            <p className='fw-bold'>Click here to go to <Link to='/home'>Home page</Link> </p>
                        </Col>
                    }
                </Row>
            }

        </Row>
    )
}

export default ForgotPassword