import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Signup.css'

const Signup = () => {
    const obj = {
        fName: '',
        lName: '',
        email: '',
        mobile: '',
        password: '',
        conPassword: '',
        profileImage: '',
        binaryData:'',
        isAdmin:false,
        isActive: true
    }
    const errorObj = {
        fName: '.',
        lName: '.',
        email: '.',
        mobile: '.',
        password: '.',
        conPassword: '.',
        profileImage: '.'
    }
    const [data, setData] = useState(obj)
    const [errors, setErrors] = useState(errorObj)
    const [response, setResponse] = useState('')
    const [isValid, setIsValid] = useState(false)
    const [otp,setOtp] = useState('')
    useEffect(() => {
        const { fName, lName, mobile, password, email, conPassword, profileImage } = errors
        if (!fName && !lName && !mobile && !email && !password && !conPassword && !profileImage) {
            setIsValid(true)
        } else {
            setIsValid(false)
        }
    }, [errors])

    const convertToBase64 =async (name, file)=> {
        let result = await new Promise((resolve, reject)=> {
            const filereader = new FileReader()
            filereader.readAsDataURL(file)
            filereader.onload =()=> {
                resolve(filereader.result)
            }
            filereader.onerror =(err)=>{
                reject(err)
            } 
        })
        setData({...data, "binaryData": result})
    }

    const handleChange = (e) => {
        const imgTypes = ['image/jpeg', 'image/png']
        const emailpattern = /^[a-z][a-z0-9]+@[a-z]+(?:[.][a-z]{2,})+$/
        const mobilePattern = /^[0-9]{10}$/
        const psdPattern = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%&*<>]).{8,}$/
        const { name, value, files } = e.target
        name === 'profileImage' ? convertToBase64(name,files[0]) : setData({ ...data, [name]: value })
        switch (name) {
            case 'fName': {
                value.length > 2 ? setErrors({ ...errors, [name]: '' }) : setErrors({ ...errors, [name]: 'Min 2 Chars required' })
                break;
            }
            case 'lName': {
                value.length > 2 ? setErrors({ ...errors, [name]: '' }) : setErrors({ ...errors, [name]: 'Min 2 Chars required' })
                break;
            }
            case 'email': {
                value.match(emailpattern) ? setErrors({ ...errors, [name]: '' }) : setErrors({ ...errors, [name]: 'Enter valid mail' })
                break;
            }
            case 'mobile': {
                value.match(mobilePattern) ? setErrors({ ...errors, [name]: '' }) : setErrors({ ...errors, [name]: '10 digits required' })
                break;
            }
            case 'password': {
                value.match(psdPattern) ? setErrors({ ...errors, [name]: '' }) : setErrors({ ...errors, [name]: 'Must has one capital letter, lowercase letter, digit, and chatracter' })
                break;
            }
            case 'conPassword': {
                value === data.password ? setErrors({ ...errors, [name]: '' }) : setErrors({ ...errors, [name]: 'Password confrim password must be same' })
                break;
            }
            case 'profileImage': {
                !imgTypes.includes(files[0].type) ? setErrors({ ...errors, [name]: 'Allwoed only jpeg/png files' }) : files[0].size > 1000000 ? setErrors({ ...errors, [name]: 'Image size must be below 1MB' }) : setErrors({ ...errors, [name]: '' })
                break;
            }
            default: {
                return
            }

        }
    }
    const addUser =(creds)=> {
        axios.post('/api/signupData', { data: creds}, {
            headers: {
                "Content-Type": "multipart/form-data",
            }
        })
            .then(res => setResponse(res.data))
            .catch(err => setResponse(JSON.stringify(err)))
        setData(obj)
    }
    const verifyData =async (checkdata)=> {
        console.log('start')
        let result = ''
        let res = await axios.get('/api/getallusers')
        let isValid = await res.data.filter(val => val.email === checkdata.email || val.mobile === checkdata.mobile)
        console.log(res, 'response ', isValid)
        if (isValid.length) {
            if (isValid[0].email === checkdata.email){
                setErrors({...errors, "email": 'Try new Email Id.'})
            } else {
                setErrors({...errors, 'mobile': 'Try new Mobile number...'})
            }
            console.log(isValid, 'isValid if')
            result = 'error red'
        } else {
            if (data.isAdmin === 'false') {
                addUser(data)
            } else {
                adminAcVerify(data)
            }
            result = 'newemailid'
        }
        return result

    }

    useEffect(()=> {
        if(otp){
            setTimeout(()=> {
                let random = window.prompt('Enter the Email verification code here : ')
                console.log(random, 'random', otp)
                if(random == otp){
                    addUser(data)
                }
                setOtp('')
            },1000)
        }
    },[otp])
    const adminAcVerify =(creds)=>{
        axios.post('/api/mailverification',{creds})
        .then(data => {
            setResponse(data.data.message)
            setOtp(data.data.psd)
        })
        .catch(err => console.log(err,'creds err'))
        setResponse('verification code is sending to your mail...')
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        const response = verifyData(data)
        
        console.log(data, 'signindata', response, errors)
    }
    return (
        <div className='signupDiv'>
            <form onSubmit={handleSubmit}>
                <div>
                    {/* <div><label>Enter your Name :</label></div> */}
                    <div><input type='text' name='fName' value={data.fName} onChange={handleChange} placeholder='Enter your firstName' required /></div>
                    <div className='errorMsz'>{errors.fName}</div>
                </div>
                <div>
                    {/* <div><label>Enter your last name :</label></div> */}
                    <div><input type='text' name='lName' value={data.lName} onChange={handleChange} required placeholder='Enter your lastName' /></div>
                    <div className='errorMsz'>{errors.lName}</div>
                </div>
                <div>
                    {/* <div><label>Enter your Email :</label></div> */}
                    <div><input type='text' name='email' value={data.email} onChange={handleChange} required placeholder='Enter your Email' /></div>
                    <div className='errorMsz'>{errors.email}</div>
                </div>
                <div>
                    {/* <div><label>Enter your Mobile Number :</label></div> */}
                    <div><input type='text' name='mobile' value={data.mobile} onChange={handleChange} required placeholder='Enter your mobile' /></div>
                    <div className='errorMsz'>{errors.mobile}</div>
                </div>
                <div>
                    {/* <div><label>Create a Password :</label></div> */}
                    <div><input type='text' name='password' value={data.password} onChange={handleChange} required placeholder='Enter your password' /></div>
                    <div className='errorMsz'>{errors.password}</div>
                </div>
                <div>
                    {/* <div><label>Confirm Password :</label></div> */}
                    <div><input type='text' name='conPassword' value={data.conPassword} onChange={handleChange} required placeholder='Enter your Confrirm Password' /></div>
                    <div className='errorMsz'>{errors.conPassword}</div>
                </div>
                <div>
                    {/* <div> <label>Upload your ProfileImage :</label></div> */}
                    <div> <input type='file' name='profileImage' defaultValue={data.binaryData} onChange={handleChange} required /></div>
                    <div className='errorMsz'>{errors.profileImage}</div>
                </div>
                <div>
                    <label>Are you admin ?</label>
                    <input type='radio' name='isAdmin' value={true} onChange={handleChange} />Yes
                    <input type='radio' name='isAdmin' value={false} onChange={handleChange} selected />No
                </div>
                <div><button type='submit' disabled={!isValid}> Submit </button> </div>
            </form>
            <div><h3>Status : {response}</h3></div>
        </div>
    )
}

export default Signup