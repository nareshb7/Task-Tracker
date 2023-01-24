import React, {useState} from 'react'

const Signup = () => {
    const obj ={
        uName: '',
        email:'',
        mobile: '',
        password:'',
        conPassword:'',
        profileImage:''
    }
    const [data, setData] = useState(obj)
    const handleChange =(e)=> {
        const {name, value} = e.target
        name== 'profileImage' ? setData({...data, [name]: e.target.files[0]}) : setData({...data, [name]: value})
    }
    const handleSubmit =(e)=> {
        e.preventDefault()
        console.log(data, 'data')
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