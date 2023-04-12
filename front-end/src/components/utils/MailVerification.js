import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const MailVerification = () => {
    const location = useLocation()
    const params = useParams()
    const navigate = useNavigate()
    const [creds, setCreds] = useState(location.state || {})
    const [otp,setOtp] = useState('1234')
    const [userOtp, setUserOtp] = useState('')
    const [response, setResponse] = useState('')
    useEffect(() => {
        if(creds.email || creds.updateKey){
            adminAcVerify(creds)
        }
    }, [])
    const otpCheck =()=> {
        console.log(otp, 'otp', userOtp)
        if (otp == userOtp){
            // addUser(data)
            navigate(`/${params.path}`, {state:{status: 'Success', data: creds}, replace : true})
            
            setUserOtp('')
            setOtp('')
        } else {
            setResponse('OTP is not matching')
        }
    }
    const adminAcVerify =(creds)=>{
        const apiPayload = creds.email || creds.updateKey
        axios.post('/api/mailverification',{apiPayload})
        .then(data => {
            setResponse(data.data.message +" - "+ creds.email)
            setOtp(data.data.psd)
        })
        .catch(err => console.log(err,'creds err'))
        setResponse('verification code is sending to your mail...')
    }
    
    return <div>
        <div>Mail Verification: </div>
        {
            otp ? <div>
                <input type='text' name='otp' value={userOtp} onChange={(e) => setUserOtp(e.target.value)} placeholder='Entere Otp here....' />
                <button onClick={otpCheck}>Enter Otp</button>
                <h3>{response}</h3>
            </div> : <h3>{response}</h3>
        }
    </div>
}
export default MailVerification