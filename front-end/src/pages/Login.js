import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { setCookie } from '../components/utils/CookieComp'
import { UserContext } from '../App'
import MyProfile from './MyProfile'
import { Col, Row, Form, Button } from 'react-bootstrap'
import './style/Login.css'

const Login = () => {
    const { currentUserVal, setCurrentUserVal, socket } = useContext(UserContext)
    const obj = {
        value: '',
        password: ''
    }
    const navigate = useNavigate()
    const [data, setData] = useState(obj)
    const [currentUser, setCurrentUser] = useState({})
    const [response, setResponse] = useState('')
    const handleChange = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        axios.post('/api/loginData', data)
            .then(res => {
                if (res.data) {
                    setCurrentUser(res.data)
                    setData(obj)    
                }
            })
            .catch(err => setResponse(err.response.data))
        setResponse('Loading......')
    }
    const loginSucessFunc = async () => {
        setCurrentUserVal(currentUser)
        setResponse('Login Sucessfully')
        console.log('LoggedIn User', currentUser)
        setCookie(currentUser._id, 2)
        socket.emit('new-user')
        navigate(-1)
    }
    useEffect(() => {
        if (Object.keys(currentUser).length > 2) {
            if (currentUser.isActive) {
                loginSucessFunc()
            } else {
                setResponse('Access Denied')
            }
        }
    }, [currentUser])
    return (
        <div>
            {
                !currentUserVal.hasOwnProperty('fName') ? (
                    <Row>
                        <Col md={7} className='login__bg'></Col>
                        <Col md={5} className='d-flex flex-direction-column align-items-center justify-content-center bg'>
                            <div>
                                <Form style={{ width: '80%', maxWidth: 500 }} onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control type="text" placeholder="Email or Mobile" name='value' value={data.value} onChange={handleChange} />
                                        <Form.Text className="text-muted">
                                            We'll never share your email with anyone else.
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" placeholder="Password" name='password' value={data.password} onChange={handleChange} />
                                    </Form.Group>
                                    <Button variant='primary' type='submit'>Login</Button>
                                </Form>
                                <div className='py-4'>
                                    <p className='text-center fw-bolder'>
                                        Don't have an account ? <Link to='/signup'>Signup</Link>
                                    </p>
                                    <p className='text-center fw-bolder'>Forgot password <NavLink to='/forgotpassword'>click here</NavLink></p>
                                    <h5> Status: {response} </h5>
                                </div>
                            </div>
                        </Col>
                    </Row>
                ) : <MyProfile currentUserVal={currentUserVal} setCurrentUserVal={setCurrentUserVal} setResponse={setResponse} socket={socket} />
            }
        </div>
    )
}

export default Login