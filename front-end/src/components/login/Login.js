import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate()
    const obj ={
        mobile:'',
        password:''
    }
    const [data, setData] = useState(obj)
    const [currentUser, setCurrentUser]= useState({})
    const [error,setError] = useState('')
    const [response, setResponse] = useState('')
    const handleChange =(e)=> {
        const {name, value } = e.target
        setData({...data, [name]: value})
    }
    const handleSubmit =async (e)=> {
        e.preventDefault()
        axios.post('http://localhost:4040/loginData', data)
        .then(data => setCurrentUser(data.data))
        .catch(err=> console.log(err, 'login err'))
        setData(obj)
    }
    const loginSucessFunc = async ()=> {
        setError('')
        axios.post('http://localhost:4040/setCurrentUser', {currentUser})
        .then(data => setResponse(data.data))
        .catch(err=> setResponse(JSON.stringify(err)))
        // navigate('/profile')
    }
    useEffect(()=> {
        delete currentUser._id
        delete currentUser._v
        if (currentUser) { 
            currentUser.hasOwnProperty('fName') ? loginSucessFunc() : setError('')
        }else {
            setError('')
        }
    },[currentUser])
  return (
    <div>
        <form onSubmit={handleSubmit}>
            <div>
                <label> Enter your mobile: </label>
                <input type='text' name='mobile' value={data.mobile} onChange={handleChange}/>
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
            <h3> Status: { response} </h3>
        </div>
    </div>
  )
}

export default Login