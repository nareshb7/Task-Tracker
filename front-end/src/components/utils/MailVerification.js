import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const MailVerification = () => {
    const location = useLocation()
    const params = useParams()
console.log(location, 'location',params)
    const navigate = useNavigate()
    const [creds, setCreds] = useState(location.state || {})
    const [result, setResult] = useState({})
    const [otp,setOtp] = useState('1234')
    const [userOtp, setUserOtp] = useState('')
    useEffect(() => {
        
        if (!otp) {
            // if (!creds.email){
            //     creds['email']= creds.updateValue
            // // }
            // axios.post('/api/mailverification', { creds })
            // .then(data => {
            //     setResult(data.data.message)
            //     setOtp(data.data.psd)
            // })
            // .catch(err => console.log(err, 'creds err'))
        }
    }, [])
    const otpCheck =()=> {
        console.log(otp, 'otp', userOtp)
        if (otp == userOtp){
            // addUser(data)
            navigate(`/${params.path}`, {state:{status: 'Success', data: creds}, replace : true})
            
            setUserOtp('')
            setOtp('')
            console.log('accounnt created')
        } else {
            // setResponse('OTP is not matching')
        }
    }
    // const adminAcVerify =(creds)=>{
    //     axios.post('/api/mailverification',{creds})
    //     .then(data => {
    //         // setResponse(data.data.message)
    //         setOtp(data.data.psd)
    //     })
    //     .catch(err => console.log(err,'creds err'))
    //     // setResponse('verification code is sending to your mail...')
    // }
    console.log(result, 'result mailverification')
    return <div>
        <div>Mail Verification: </div>
        {
            otp ? <div>
                <input type='text' name='otp' value={userOtp} onChange={(e) => setUserOtp(e.target.value)} placeholder='Entere Otp here....' />
                <button onClick={otpCheck}>Enter Otp</button>
            </div> : <h3>Otp is sending to ur mail....</h3>
        }
    </div>
}
export default MailVerification