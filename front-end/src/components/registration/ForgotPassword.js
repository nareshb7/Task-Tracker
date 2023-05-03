import axios from 'axios'
import React, { useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { fetchCall } from '../utils/fetch/UseFetch'
import { psdPattern } from '../utils/Constants'

const ForgotPassword = () => {
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
        setResponse('Updating...')
        const res = await fetchCall('api/adminupdateuser', { id: data._id, updateKey: 'password', updateValue: newPsd.psd })
        setResponse('Successfully Changed')
        console.log('Passsowrd', res)
        setNewpsd({})
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
            <Row><h3>Status : {response}</h3></Row>
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
                            <Form.Control className='my-1' type='password' value={newPsd.psd} name='psd' placeholder='Enter new Password' onChange={handlePasswordChange} />
                            <Form.Control className='my-1' type='password' value={newPsd.conPsd} name='conPsd' placeholder='Confirm Password' onChange={handlePasswordChange} />
                            <Button type='submit' >Submit</Button>
                        </Form>
                    }
                </Row>
            }

        </Row>
    )
}

export default ForgotPassword