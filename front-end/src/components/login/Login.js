import React, {useState} from 'react'

const Login = () => {
    const obj ={
        mobile:'',
        password:''
    }
    const [data, setData] = useState(obj)
    const handleChange =(e)=> {
        const {name, value } = e.target
        setData({...data, [name]: value})
    }
    const handleSubmit =(e)=> {
        e.preventDefault()
        console.log(data, 'login Data')
        setData(obj)
    }
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
    </div>
  )
}

export default Login