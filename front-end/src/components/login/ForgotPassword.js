import axios from 'axios'
import React, { useState } from 'react'

const ForgotPassword = () => {
    const [searchIpt, setSearchIpt] = useState('')
    const [mobile, setMobile] = useState({})
    const [response, setResponse] = useState('')
    const [fName, setfName] = useState('')
    const [password, setPassword] = useState('')
    const handleClick = () => {
        axios.get('/api/getallusers')
            .then(data => {
                let res = data.data.filter(val => val.mobile == searchIpt || val.email == searchIpt)
                if (res.length) {
                    setMobile(res[0])
                    setResponse('Data found')
                } else {
                    setResponse('Data not found')
                    setMobile({})
                }
            })
            .catch(err => console.log(err))
        setResponse('Checking the database...')
        setfName('')
        setPassword('')
        
    }
    console.log(mobile, 'mobile')
    const handleName = () => {
        let res = mobile.fName == fName
        console.log(res, 'res')
        if (res){
            setPassword(`Your password is : ${mobile.password}`)
        } else {
            setPassword('Name not matching')
        }
    }
    return (
        <div>
            <div>
                <input type='text' name='mobile' value={searchIpt} onChange={(e) => setSearchIpt(e.target.value)} placeholder='Enter email or mobile' />
            </div>
            <div><button onClick={handleClick}>Search</button></div>
            <div><h3>Status : {response}</h3></div>
            {
                mobile.hasOwnProperty('mobile') && <div>
                    <div>
                        <input type='text' name='fName' value={fName} onChange={(e) => setfName(e.target.value)} placeholder='Enter your first name here...' />
                        <button onClick={handleName}>Check </button>
                    </div>
                    <div>
                        {
                            password &&  <h3>{password} </h3>
                        }
                    </div>
                </div>
            }

        </div>
    )
}

export default ForgotPassword