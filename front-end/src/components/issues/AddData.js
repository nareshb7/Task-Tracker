import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { UserContext } from '../../App'

const AddData = () => {
    const { currentUserVal, setCurrentUserVal } = useContext(UserContext)
    const [isLoggedin, setIsLoggedIn] = useState([])
    const technologies = ['Select the technology', "React", "Angular", "JavaScript", "CSS"]
    const AppTypesDataList = ['Banking', 'E-commerce', 'Oil', 'Stocks', 'Logistics', 'OTT']
    const [status, setStatus] = useState('')
    const [img, setImg] = useState('')
    const obj = {
        dName: isLoggedin.fName + " " + isLoggedin.lName,
        cName: '',
        technology: '',
        issue: '',
        time: '',
        mobile: '',
        binaryData: '',
        issueTitle: '',
        solutions: [],
        solution: '',
        companyName: '',
        appType: '',
        developerId: '',
        images: ""
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
        return result
    }

    const handleChange = async (e) => {
        const { name, value } = e.target
        name === 'images' ? convertToBase64(e.target.files[0]) : setData({ ...data, [name]: value })

    }

    const handleSubmit =async (newData) => {
        newData.time = new Date()
        newData.dName = isLoggedin.fName + " " + isLoggedin.lName
        console.log(newData.images, 'images')
        newData.binaryData = await convertToBase64(newData.images)
        // newData.mobile = isLoggedin.mobile
        // newData.email = isLoggedin.email
        newData.developerId = isLoggedin._id
        newData.solutions = [{ solution: newData.solution }]
        isLoggedin.uploadedIssues.push(newData)
        
        
        console.log( 'newData submitted',newData,isLoggedin)
        // setCurrentUserVal(isLoggedin)
        const id = isLoggedin._id
        const updateData = JSON.parse(JSON.stringify(isLoggedin))
        delete updateData.images
        delete updateData._id
        delete newData.images
        axios.post("/api/setData", { "data": newData })
            .then(data => setStatus('Data Added Sucessfully'))
            .catch(err => setStatus(`Error Occured : ${JSON.stringify(err)}`))
        axios.post('api/adminupdateuser', { id: id, updateValue: updateData, update: 'MULTIPLE' })
            .then(res => console.log('User Val Updated', res))
            .catch(err => console.log(err, ';errrr user updating'))
        setData(obj)
        setStatus('Submitting...')
        delete newData.solution
    }
    const handleValidate =(val)=> {
        console.log('validate', val)
    }
    const schema = {

    }
    return (
        <> {
            Array.isArray(isLoggedin) ? "Loading...." : <>
                {
                    isLoggedin.hasOwnProperty('fName') ? <div>
                        <Formik
                            initialValues={obj}
                            validationSchema={Yup.object().shape(schema)}
                            onSubmit={handleSubmit}
                            validate={handleValidate}
                        >
                            {({ values, errors, setFieldValue, touched }) => (
                                <Form>
                                    <div>
                                        <div>
                                            <label>Enter Developer Name : </label>
                                        </div>
                                        <Field name='dName' disabled />
                                    </div>
                                    <div>
                                        <label>Enter Client Name : </label>
                                        <Field name='cName' placeholder='Enter Client name...' type='text' className={`inputField ${errors.cName && touched.cName
                                            ? 'is-invalid'
                                            : ''
                                            }`} />
                                        <ErrorMessage name='cName' coponent='div' className='errMsz' />
                                    </div>
                                    <div>
                                        <label>Mention the technology: </label>
                                        <Field as='select' name='technology'>
                                            {
                                                technologies.map((val, idx) => {
                                                    return (
                                                        <option key={idx} value={val}>{val}</option>
                                                    )
                                                })
                                            }
                                        </Field>
                                        <ErrorMessage name='technology' coponent='div' className='errMsz' />
                                    </div>
                                    <div>
                                        <label>Provide the Company Name : </label>
                                        <Field type='text' name='companyName' placeholder='Provide company name...' />
                                        <ErrorMessage name='companyName' component={'div'} className='errMsz' />
                                    </div>
                                    <div>
                                        <label>Application Type:</label>
                                        <Field type='text' name='appType' list='applicationTypes' placeholder='Application Type..'/>
                                        <datalist id='applicationTypes'>
                                            {
                                                AppTypesDataList.map((app, idx) => {
                                                    return (
                                                        <option key={idx} value={app}>{app}</option>
                                                    )
                                                })
                                            }
                                        </datalist>
                                        <ErrorMessage name='appType' component='div' />
                                    </div>
                                    <div>
                                        <label>Upload Issue Image : </label>
                                        <input type='file' onChange={(e)=>setFieldValue('images', e.target.files[0]) } />
                                        <ErrorMessage name='images' component='div' className='errMsz' />
                                    </div>
                                    <div>
                                        <label>Issue Title : </label>
                                        <Field type='text' name='issueTitle' placeholder='Issue title...' />
                                        <ErrorMessage name='issueTitle' component='div' className='errMsz' />
                                    </div>
                                    <div>
                                        <label>Describe the issue :  </label>
                                        <Field as='textarea' rows='5' cols={50} name='issue' placeholder='Describe issue here..' />
                                        <ErrorMessage name='issue' component='div' className='errMsz' />
                                    </div>
                                    <div>
                                        <label>Describe the Solution :  </label>
                                        <Field as='textarea' rows='5' cols={50} name='solution' placeholder='What are the changes u made..' />
                                        <ErrorMessage name='solution' component='div' className='errMsz' />
                                    </div>
                                    <div>
                                        <button type='submit'>Add Data</button>
                                    </div>
                                </Form>
                            )}

                        </Formik>  
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