import React, { useState, useEffect, useContext } from 'react'
// import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { setCookie } from '../utils/CookieComp'
import { UserContext } from '../../App'
import MyProfile from '../profile/MyProfile'

const Login = () => {
    const {currentUserVal, setCurrentUserVal} = useContext(UserContext)
    const obj = {
        mobile: '',
        password: ''
    }
    console.log('isLoggedin', currentUserVal)
    const [data, setData] = useState(obj)
    const [currentUser, setCurrentUser] = useState({})
    const [response, setResponse] = useState('')
    const handleChange = (e) => {
        const { name, value } = e.target
        setData({ ...data, [name]: value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        // axios.post('/api/loginData', data)
        //     .then(res => {
        //         if (res.data){
        //             if (res.data.password == data.password ) {
        //                 setCurrentUser(res.data)
        //             setData(obj)
        //             } else {
        //                 setResponse('Password not matching..')
        //             }
                    
        //         } else {
        //             setResponse('No user found..')
        //         }
        //     })
        //     .catch(err => console.log(err, 'login err'))
        setResponse('Loading......')
    }
    const loginSucessFunc = async () => {
        // axios.post('/api/currentuserid', { id: currentUser._id })
        //     .then(data => setResponse(data.data))
        //     .catch(err => setResponse(err.message))
        setCurrentUserVal(currentUser)
        setResponse('Login Sucessfully')
        setCookie(currentUser._id, 2)
    }
    useEffect(() => {
        if (Object.keys(currentUser).length > 2) {
            if (currentUser.isActive) {
                loginSucessFunc()
            }else {
                setResponse('Access Denied')
            }
        } 
    }, [currentUser])
    return (
        <div>
            {
                !currentUserVal.hasOwnProperty('fName') ? (
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
                            <h4>Forgot password <NavLink to='/forgotpassword'>click here</NavLink></h4>
                            <h3> Status: {response} </h3>
                        </div>
                    </>
                ) : <MyProfile currentUserVal={currentUserVal} setCurrentUserVal={setCurrentUserVal} />
            }
        </div>
    )
}

export default Login