import React, {useState} from 'react'
import axios from 'axios'

const Signup = () => {
    const obj ={
        uName: '',
        email:'',
        mobile: '',
        password:'',
        conPassword:''
    }
    const [image, setProfileImage] = useState('')
    const [data, setData] = useState(obj)
    const handleChange =(e)=> {
        const {name, value} = e.target
        name== 'profileImage' ? setProfileImage(e.target.files[0]) : setData({...data, [name]: value})
    }
    const handleSubmit =(e)=> {
        e.preventDefault()
        console.log(data, image, 'signup')
        axios.post('http://localhost:4040/signupData', {data:data,profileImage: image }, {headers: {
            "Content-Type": "multipart/form-data",
          }})
        .then(res => console.log(res, 'success'))
        .catch(err=> console.log(err, 'err'))
        setData(obj)
    }
  return (
    <div>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Enter your Name :</label>
                <input type='text' name='uName' value={data.uName} onChange={handleChange}/>
            </div>
            <div>
                <label>Enter your Email :</label>
                <input type='text' name='email' value={data.email} onChange={handleChange}/>
            </div>
            <div>
                <label>Enter your Mobile NUmber :</label>
                <input type='text' name='mobile' value={data.mobile} onChange={handleChange}/>
            </div>
            <div>
                <label>Create a Password :</label>
                <input type='text' name='password' value={data.password} onChange={handleChange}/>
            </div>
            <div>
                <label>Confirm Password :</label>
                <input type='text' name='conPassword' value={data.conPassword} onChange={handleChange}/>
            </div>
            <div>
                <label>Upload your ProfileImage :</label>
                <input type='file' name='profileImage' defaultValue={''} onChange={handleChange}/>
            </div>
            <div><button type='submit'> Submit </button> </div>
        </form>
    </div>
  )
}

export default Signup