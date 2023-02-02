import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import useAuth from '../authentication/Authentication'
import { setCookie } from '../cookieset/CookieComp'

const Login = () => {
    const isLoggedIn = useAuth()
    const navigate = useNavigate()
    const obj = {
        mobile: '',
        password: ''
    }
    const adminObj = {
        mobile: '1234567890',
        password:'test@1234'
    }
    const [data, setData] = useState(obj)
    const [currentUser, setCurrentUser] = useState({})
    const [response, setResponse] = useState('')
    const handleChange = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(data, adminObj)
        if (data.mobile == adminObj.mobile && data.password == adminObj.password) {
            let val = window.confirm('Are you a Admin??')
            if (val) {
                console.log('he is admin')
            }
            return 
        }
        axios.post('/api/loginData', data)
            .then(data => setCurrentUser(data.data))
            .catch(err => console.log(err, 'login err'))
        setData(obj)
    }
    const loginSucessFunc = async () => {
        axios.post('/api/currentuserid', { id: currentUser._id })
            .then(data => setResponse(data.data))
            .catch(err => setResponse(err.message))
        setCookie(currentUser._id, 2)
    }
    useEffect(() => {
        if (Object.keys(currentUser).length > 2) {
            loginSucessFunc()
        }
        console.log(currentUser, 'logincurentuser')
    }, [currentUser])
    return (
        <div>
            {
                isLoggedIn.hasOwnProperty('fName') ? navigate('/profile') : (
                    <>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>Enter your mobile: </label>
                                <input type='text' name='mobile' value={data.mobile} onChange={handleChange} />
                            </div>
                            <div>
                                <label>Enter your password</label>
                                <input type='text' name='password' value={data.password} onChange={handleChange} />
                            </div>
                            <div>
                                <button type='submit'>Login</button>
                            </div>
                        </form>
                        <div>
                            <h3> Status: {response} </h3>
                        </div>
                    </>
                )
            }

        </div>
    )
}

export default Login