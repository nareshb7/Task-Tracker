import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { UserContext } from '../../App'

const AddData = () => {
    const { currentUserVal, setCurrentUserVal } = useContext(UserContext)
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
        issueTitle: '',
        solutions:[],
        solution:'',
        companyName:'',
        appType:''
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
        data.email = isLoggedin.email
        data.solutions = [ {solution: data.solution}]
        isLoggedin.uploadedIssues.push(data)
        const addTech = isLoggedin.technologies.indexOf(data.technology)
        console.log(addTech, 'inexof')
        if (addTech == -1) {
            isLoggedin.technologies.push(data.technology)
        }
       // setCurrentUserVal(isLoggedin)
       const id = isLoggedin._id
       const updateData = JSON.parse(JSON.stringify(isLoggedin))
       
       delete updateData._id
        console.log(data, 'submit data', id, isLoggedin, updateData)
        axios.post("/api/setData", { "data": data })
        .then(data => setStatus('Data Added Sucessfully'))
        .catch(err => setStatus(`Error Occured : ${JSON.stringify(err)}`))
        axios.post('api/adminupdateuser', {id :id ,updateValue: updateData, update: 'MULTIPLE'})
        .then(res => console.log('User Val Updated',res))
        .catch(err => console.log(err, ';errrr user updating'))
        setData(obj)
        setStatus('Submitting...')
        delete data.solution
        // console.log('submitted')
    }
    console.log(currentUserVal, 'currentUserVal')
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
                                    <input type='text' name='cName' placeholder='Enter Client name..' value={data.cName} onChange={handleChange} required />
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
                                        <option value='new'>Add + </option>
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label>Provide the Company Name : </label>
                                <input type='text' name='companyName' placeholder='Provide company name...' value={data.companyName} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Application Type:</label>
                                <input type='text' name='appType' placeholder='Application Type..' value={data.appType} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Upload Issue Image : </label>
                                <input type='file' name='images' defaultValue={data.binaryData} onChange={handleChange} required />
                            </div>
                            <div>
                                <label>Issue Title : </label>
                                <input type='text' name='issueTitle' placeholder='Issue title...' value={data.issueTitle} onChange={handleChange} />
                            </div>
                            <div>
                                <label>Describe the issue :  </label>
                                <textarea rows='5' cols={50} name='issue' onChange={handleChange} placeholder='Describe issue here..' value={data.issue} required></textarea>
                            </div>
                            <div>
                                <label>Describe the Solution :  </label>
                                <textarea rows='5' cols={50} name='solution' placeholder='What are the changes u made..' onChange={handleChange} value={data.solution}></textarea>
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