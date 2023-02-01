import React, { useState } from 'react'
import axios from 'axios'
import useAuth from '../authentication/Authentication'
import { NavLink } from 'react-router-dom'

const AddData = () => {
    const isLoggedin = useAuth()
    const technologies = ["React", "Angular", "JavaScript", "CSS"]
    const [status, setStatus] = useState('')
    const [img, setImg] = useState('')
    const obj = {
        dName: '',
        cName: '',
        technology: 'React',
        issue: '',
        time: '',
        mobile:'',
        binaryData: ''
    }
    let [data, setData] = useState(obj)   

    if (!isLoggedin.hasOwnProperty('fName')) {
        return (
            <div>
                <h2>U can't add data please login</h2>
                <div>Click here to <NavLink to='/login' >Login</NavLink></div>
            </div>
        )
    }
    const convertToBase64 =async (file)=> {
         let result = await new Promise((resolve,reject)=> {
            const filereader = new FileReader()
            filereader.readAsDataURL(file)
            filereader.onload =() => {
                resolve(filereader.result)
            }
            filereader.onerror =(error)=> {
                reject(error)
            }
         })
         setImg(file)
         setData({...data, 'binaryData': result})
    }

    const handleChange =async  (e) => {
        const { name, value } = e.target
        name === 'images' ? convertToBase64(e.target.files[0]) : setData({ ...data, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        data.time = new Date().toLocaleString()
        data.dName = isLoggedin.fName + " "+ isLoggedin.lName
        data.mobile = isLoggedin.mobile
        console.log(data, 'submit data')
        axios.post("http://localhost:4040/setData", { data: data, testImage: img },
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                }
            })
            .then(data => setStatus('Data Added Sucessfully'))
            .catch(err => setStatus(`Error Occured : ${JSON.stringify(err)}`))
        setData(obj)
        setImg('')
        // console.log('submitted')
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <span>Enter Developer Name :</span>
                        <input type='text' name='dName' value={isLoggedin.fName +" "+ isLoggedin.lName} disabled={isLoggedin.fName} onChange={handleChange} required />
                    </label>
                </div>
                <div>
                    <label>
                        <span>Enter Client Name :</span>
                        <input type='text' name='cName' value={data.cName} onChange={handleChange} required/>
                    </label>
                </div>
                <div>
                    <label>
                        <span>Mention the Technology</span>
                        <select name='technology' value={data.technology} onChange={handleChange} required>
                            {
                                technologies.map((val, idx) => {
                                    return (
                                        <option key={idx} value={val}>{val}</option>
                                    )
                                })
                            }
                        </select>
                    </label>
                </div>
                <div>
                    <input type='file' name='images' defaultValue={img} onChange={handleChange} required />
                </div>
                <div>
                    <label>Describe the issue :  </label>
                    <textarea name='issue' onChange={handleChange} value={data.issue} required></textarea>
                </div>
                <div>
                    <button type='submit'>Add Data</button>
                </div>
            </form>
            <div>
                <h3>Status : {status}</h3>
            </div>
        </div>
    )
}

export default AddData