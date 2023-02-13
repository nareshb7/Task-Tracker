import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { UserContext } from '../../App'

const AddData = () => {
    const { currentUserVal } = useContext(UserContext)
    const [isLoggedin, setIsLoggedIn] = useState([])
    const technologies = ["React", "Angular", "JavaScript", "CSS"]
    const [status, setStatus] = useState('')
    const [img, setImg] = useState('')
    const obj = {
        dName: '',
        cName: '',
        technology: 'React',
        issue: '',
        time: '',
        mobile: '',
        binaryData: '',
        issueTitle: ''
    }
    let [data, setData] = useState(obj)
    useEffect(() => {
        if (currentUserVal) {
            setIsLoggedIn(currentUserVal)
        }
    }, [currentUserVal])

    const convertToBase64 = async (file) => {
        let result = await new Promise((resolve, reject) => {
            const filereader = new FileReader()
            filereader.readAsDataURL(file)
            filereader.onload = () => {
                resolve(filereader.result)
            }
            filereader.onerror = (error) => {
                reject(error)
            }
        })
        setData({ ...data, 'binaryData': result })
    }

    const handleChange = async (e) => {
        const { name, value } = e.target
        name === 'images' ? convertToBase64(e.target.files[0]) : setData({ ...data, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        data.time = new Date().toLocaleString()
        data.dName = isLoggedin.fName + " " + isLoggedin.lName
        data.mobile = isLoggedin.mobile
        console.log(data, 'submit data')
        axios.post("/api/setData", { "data": data })
            .then(data => setStatus('Data Added Sucessfully'))
            .catch(err => setStatus(`Error Occured : ${JSON.stringify(err)}`))
        setData(obj)
        setStatus('Submitting...')
        // console.log('submitted')
    }
    return (
        <> {
            Array.isArray(isLoggedin) ? "Loading...." : <>
                {
                    isLoggedin.hasOwnProperty('fName') ? <div>
                        <form onSubmit={handleSubmit}>
                            <div>
                                <label>
                                    <span>Enter Developer Name :</span>
                                    <input type='text' name='dName' value={isLoggedin.fName + " " + isLoggedin.lName} disabled={isLoggedin.fName} onChange={handleChange} required />
                                </label>
                            </div>
                            <div>
                                <label>
                                    <span>Enter Client Name :</span>
                                    <input type='text' name='cName' value={data.cName} onChange={handleChange} required />
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
                                <label>Issue Title : </label>
                                <input type='text' name='issueTitle' value={data.issueTitle} onChange={handleChange} />
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
                    </div> : <div>
                        <h2>U can't add data please login</h2>
                        <div>Click here to <NavLink to='/login' >Login</NavLink></div>
                    </div>
                }
            </>
        }


        </>
    )
}

export default AddData