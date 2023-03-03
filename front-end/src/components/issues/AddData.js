import React, { useState, useContext, useEffect } from 'react'
import axios from 'axios'
import { NavLink } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik'
import * as Yup from 'yup'
import { UserContext } from '../../App'

const AddData = () => {
    const { currentUserVal, setCurrentUserVal } = useContext(UserContext)
    const [isLoggedin, setIsLoggedIn] = useState([])
    const technologies = ['Select the technology', "React", "Angular", "JavaScript", "CSS"]
    const AppTypesDataList = ['Banking', 'E-commerce', 'Oil', 'Stocks', 'Logistics', 'OTT']
    const [status, setStatus] = useState('')
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
        images: "",
        issueImages: [{ image: '' }]
    }
    const schema = {
        cName: Yup.string().required('String required'),
        technology: Yup.string().required('Mention the technology'),
        issue: Yup.string().required('Describe the Issue'),
        issueTitle: Yup.string().required('Mention the main Issue'),
        solution: Yup.string().required('Mention what are the changes u made'),
        companyName: Yup.string().required('Enter the company name'),
        appType: Yup.string().required('Provide the application type'),
        // images: Yup.mixed()
        //     .nullable()
        //     .test('FILE-TYPE', 'Upload Image files only', (value) => ['image/jpeg', 'image/png'].includes(value.type))
        //     .test('FILE-SIZE', 'File is too large', (value) => value.size < 300000)
        //     .required('File required'),
    }
    useEffect(() => {
        if (currentUserVal) {
            setIsLoggedIn(currentUserVal)
        }
    }, [currentUserVal])

    const convertToBase64 = async (file) => {
        if (file){
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
            return result
        }
    }
    const handleFunction =async (files)=> {
        // let result = await convertToBase64(file[0].image)
        // console.log(result, 'result')
        return await Promise.all(files.map((file )=> convertToBase64(file.image)))
    }
    const handleSubmit =async (newData) => {
        newData.time = new Date()
        newData.dName = isLoggedin.fName + " " + isLoggedin.lName
        // newData.binaryData = await convertToBase64(newData.issueImages[0].image)
        newData.binaryData =await Promise.all(newData.issueImages.map((file )=> convertToBase64(file.image)))
        newData.developerId = isLoggedin._id
        newData.solutions = [{ solution: newData.solution }]
        console.log('newData submitted', newData, isLoggedin)
        delete newData.images
        axios.post("/api/setData", { "data": newData })
            .then(data => setStatus('Data Added Sucessfully'))
            .catch(err => setStatus(`Error Occured : ${JSON.stringify(err)}`))
        setStatus('Submitting...')
    }
    const handleValidate = (val) => {
        // console.log('validate', val)
    }
    
    const handleClick = (values, setValues, field) => {
        const { issueImages } = values
        issueImages.push({ image: '' })
        setValues({ ...values, issueImages })
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
                            {({ values, errors, setFieldValue, touched, setValues }) => (
                                <Form className='addIssueForm signupDiv'>
                                    <div>
                                        <div>
                                            <label>Enter Developer Name : </label>
                                        </div>
                                        <Field name='dName' disabled />
                                    </div>
                                    <div>
                                        <div>
                                            <label>Enter Client Name : </label>
                                        </div>
                                        <Field name='cName' placeholder='Enter Client name...' type='text' className={`inputField ${errors.cName && touched.cName
                                            ? 'is-invalid'
                                            : ''
                                            }`} />
                                        <ErrorMessage name='cName' component='div' className='errMsz' />
                                    </div>
                                    <div>
                                        <div>
                                            <label>Mention the technology: </label>
                                        </div>
                                        <Field as='select' name='technology' className={`inputField ${errors.technology && touched.technology
                                            ? 'is-invalid'
                                            : ''
                                            }`} >
                                            {
                                                technologies.map((val, idx) => {
                                                    return (
                                                        <option key={idx} value={val}>{val}</option>
                                                    )
                                                })
                                            }
                                        </Field>
                                        <ErrorMessage name='technology' component='div' className='errMsz' />
                                    </div>
                                    <div>
                                        <div>
                                            <label>Provide the Company Name : </label>
                                        </div>
                                        <Field type='text' name='companyName' placeholder='Provide company name...' className={`inputField ${errors.companyName && touched.companyName
                                            ? 'is-invalid'
                                            : ''
                                            }`} />
                                        <ErrorMessage name='companyName' component={'div'} className='errMsz' />
                                    </div>
                                    <div>
                                        <div>
                                            <label>Application Type:</label>
                                        </div>
                                        <Field type='text' name='appType' list='applicationTypes' placeholder='Application Type..' className={`inputField ${errors.appType && touched.appType
                                            ? 'is-invalid'
                                            : ''
                                            }`} />
                                        <datalist id='applicationTypes'>
                                            {
                                                AppTypesDataList.map((app, idx) => {
                                                    return (
                                                        <option key={idx} value={app}>{app}</option>
                                                    )
                                                })
                                            }
                                        </datalist>
                                        <ErrorMessage name='appType' component='div' className='errMsz' />
                                    </div>
                                    {/* <div>
                                        <div>
                                            <label>Upload Issue Image : </label>
                                        </div>
                                        <input id='file' onChange={(e) => setFieldValue(`images`, e.target.files[0])} type="file" className={`inputfile inputField ${errors.images && touched.images
                                            ? 'is-invalid'
                                            : ''
                                            }`} />
                                        <label htmlFor='file'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z" /></svg> <span>{values.images?.name ? `${values.images?.name.slice(0, 5)}` : 'Choose a file'} &hellip;</span></label>
                                        <ErrorMessage name='images' component={'div'} className='errMsz' />
                                    </div> */}
                                    <div className='issueImage'>
                                        <Field>

                                            {({ field }) => (
                                                <div>
                                                    <label>Upload Issue Image : </label>
                                                    <button type='button' onClick={() => handleClick(values, setValues, field)}>Add Image</button>
                                                </div>
                                            )}

                                        </Field>
                                        <FieldArray >
                                            {() =>
                                                values.issueImages?.map((image, idx) => {
                                                    return (
                                                        <div key={idx}>
                                                            <input id={`file${idx}`} onChange={(e) => setFieldValue(`issueImages.${idx}.image`, e.target.files[0])} type="file" className={`inputfile inputField ${true ? 'is-invalid' : ''}`} />
                                                            <label htmlFor={`file${idx}`} ><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z" /></svg> <span>{values.issueImages[idx]?.image?.name ? `${values.issueImages[idx]?.image.name.slice(0, 5)}` : 'Choose a file'} &hellip;</span></label>
                                                            <ErrorMessage name={`issueImages.${idx}.image`} component={'div'} className='errMsz' />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </FieldArray>
                                    </div>
                                    <div>
                                        <div>
                                            <label>Issue Title : </label>
                                        </div>
                                        <Field type='text' name='issueTitle' placeholder='Issue title...' className={`inputField ${errors.issueTitle && touched.issueTitle
                                            ? 'is-invalid'
                                            : ''
                                            }`} />
                                        <ErrorMessage name='issueTitle' component='div' className='errMsz' />
                                    </div>
                                    <div>
                                        <div>
                                            <label>Describe the issue :  </label>
                                        </div>
                                        <Field as='textarea' rows='5' cols={50} name='issue' placeholder='Describe issue here..' className={`inputField ${errors.issue && touched.issue
                                            ? 'is-invalid'
                                            : ''
                                            }`} />
                                        <ErrorMessage name='issue' component='div' className='errMsz' />
                                    </div>
                                    <div>
                                        <div>
                                            <label>Describe the Solution :  </label>
                                        </div>
                                        <Field as='textarea' rows='5' cols={50} name='solution' placeholder='What are the changes u made..' className={`inputField ${errors.solution && touched.solution
                                            ? 'is-invalid'
                                            : ''
                                            }`} />
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