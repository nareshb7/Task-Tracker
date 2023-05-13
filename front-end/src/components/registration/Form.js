import React, { useEffect } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field, ErrorMessage } from 'formik';
// import './Form.css';
import { Row, Col, Button } from 'react-bootstrap';
import { emailpattern, mblPattern, psdPattern } from '../utils/Constants';

const SignupForm = ({ submitFunc, formData, error, isSubmitted, component }) => {
  const initialObj = {
    fName: '',
    lName: '',
    mobile: '',
    email: "",
    password: '',
    conPassword: '',
    gender: '',
    profileImage: '',
    binaryData: '',
    isAdmin: false,
    isActive: true,
    reqforAdmin: false,
    solutions: [],
    designation: '',
    dob:new Date()
  };
  
  const schema = {
    fName: Yup.string().required('First Name is Required'),
    lName: Yup.string().required('Last Name is required'),
    email: Yup.string().matches(emailpattern, 'Enter valid email').required('Email Required'),
    mobile: Yup.string()
      .matches(mblPattern, 'Mobile Number not Valid')
      .required('Mobile Number required'),
    password: Yup.string()
      .matches(psdPattern, 'Password must contain one upper, one lower, digit and character')
      .min(4, 'min 4 chars required')
      .required('Password required'),
    conPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Password must match')
      .required('Confirm Password is required'),
    gender: Yup.string().required('Gender required'),
    profileImage: Yup.mixed()
      .nullable()
      .test('FILE-TYPE', 'Upload Image files only', (value) =>
        ['image/jpeg', 'image/png'].includes(value.type)
      )
      .test('FILE-SIZE', 'File is too large', (value) => value.size < 300000)
      .required('File required'),
    designation: Yup.string().required('Designation required')
  };
  const removeImage = () => {
    console.log('image dlt clicked')
  }
  useEffect(() => {
    if (component == 'UPDATE') {
      formData['profileImage'] = dataURLtoFile(formData.binaryData, 'image.jpeg');
    }
  }, [])
  const convertToBase64 = async (file) => {
    let result = await new Promise((resolve, reject) => {
      const filereader = new FileReader()
      filereader.readAsDataURL(file)
      filereader.onload = () => {
        resolve(filereader.result)
      }
      filereader.onerror = (err) => {
        reject(err)
      }
    })
    return result
  }
  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  //Usage example:
  const handleSubmit = async (val, actions) => {
    val.binaryData = await convertToBase64(val.profileImage)
    delete val.profileImage
    console.log('submit')
    submitFunc(val)
    // val.setSubmitting(isSubmitted)
  };
  const handleValidate = async (val) => {
    console.log(val, 'validate func')
  }
  return (
    <Row>
      <Col md={6} className='m-auto' >
        <h3 className='text-center py-4'>{component || 'Signup'}</h3>
        <Formik
          initialValues={formData || initialObj}
          validationSchema={Yup.object().shape(schema)}
          onSubmit={handleSubmit}
          validate={handleValidate}
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form className="form">
              <Row>
                <Col md={6}>{
                  console.log('errors', errors)
                }
                  <Field type='text' name='fName' placeholder='Enter your first name' className={`m-1 form-control inputField ${errors.fName && touched.fName
                    ? 'is-invalid'
                    : ''
                    }`} />
                  <ErrorMessage name='fName' component='div' className='errMsz' />
                </Col>
                <Col md={6}>
                  <Field type='text' name='lName' placeholder='Enter your Last name' className={`m-1 form-control inputField ${errors.lName && touched.lName
                    ? 'is-invalid'
                    : ''
                    }`} />
                  <ErrorMessage name='lName' component='div' className='errMsz' />
                </Col>
              </Row>{
                console.log('Vslauye', values)
              }
              <Row>
                <Col md={6}>
                  <Field type='text' name='email' disabled={component} placeholder='Enter your Email' className={`m-1 form-control inputField ${(errors.email && touched.email) || (error?.email)
                    ? 'is-invalid'
                    : ''
                    }`} />
                  <ErrorMessage name='email' component='div' className='errMsz' />
                </Col>
                <Col md={6}>
                  <Field type='text' disabled={component} name='mobile' placeholder='Enter your Mobile number' className={`m-1 form-control inputField ${(errors.mobile && touched.mobile) || (error?.mobile)
                    ? 'is-invalid'
                    : ''
                    }`} />
                  <ErrorMessage name='mobile' component='div' className='errMsz' />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Field type='password' name='password' placeholder='Enter a new password' className={`m-1 form-control inputField ${errors.password && touched.password
                    ? 'is-invalid'
                    : ''
                    }`} />
                  <ErrorMessage name='password' component='div' className='errMsz' />
                </Col>
                <Col md={6}>
                  <Field type='password' name='conPassword' placeholder='Confirm Password' className={`m-1 form-control inputField ${errors.conPassword && touched.conPassword
                    ? 'is-invalid'
                    : ''
                    }`} />
                  <ErrorMessage name='conPassword' component='div' className='errMsz' />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Field type='text' name='designation' placeholder='Your role in company' className={`m-1 form-control inputField ${errors.designation && touched.designation
                    ? 'is-invalid'
                    : ''
                    }`} />
                  <ErrorMessage name='designation' component='div' className='errMsz' />
                </Col>
                <Col md={6}>
                  <Field as='select' name='gender' placeholder='Enter your first name' className={`m-1 form-control inputField ${errors.gender && touched.gender
                    ? 'is-invalid'
                    : ''
                    }`}>
                    <option value=''>Select an option</option>
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                    <option value='notspecify'>Not specify</option>
                  </Field>
                  <ErrorMessage name='gender' component='div' className='errMsz' />
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <input id='file' onChange={(e) => setFieldValue(`profileImage`, e.target.files[0])} type="file" className={`m-1 form-control inputfile inputField ${errors.profileImage && touched.profileImage
                    ? 'is-invalid'
                    : ''
                    }`} />
                  {/* <label htmlFor='file'><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z" /></svg> <span>{values.profileImage?.name ? `${values.profileImage?.name.slice(0, 5)}` : 'Choose a file'} &hellip;</span></label> */}
                  <ErrorMessage name='profileImage' component={'div'} className='errMsz' />
                </Col>
                
                <Col md={6}>
                  <label>Enter DOB:</label>
                  <Field className='form-control' type='date' name='dob' />
                </Col>
                <Col md={6} style={{ display: 'flex', flexWrap: 'wrap', position: 'relative' }}>
                  {
                    values.binaryData && !values.binaryData.name && <div><div style={{ width: '100px', height: '100px' }}>
                      <img src={values.binaryData} style={{ width: '100%', height: '100%' }} /></div>
                      <button style={{ position: 'absolute', top: '0', right: '0', padding: '5px' }} onClick={removeImage}>X</button></div>
                  }

                </Col>

              </Row>
              <Row className='m-2'>
                <Col className='text-center '>
                  <Button variant='primary' type="submit">Submit</Button>
                </Col>
              </Row>

            </Form>
          )}
        </Formik>
      </Col>
    </Row>
  );
};
export default SignupForm;