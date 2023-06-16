import React, { useContext, useEffect, useState } from 'react'
import Modal from './Modal'
import { Button, Col, Container, Row } from 'react-bootstrap'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { fetchCall, fetchGetCall } from '../utils/fetch/UseFetch'
import { addActivity } from '../../pages/activityPage/ActivityPage'
import { UserContext } from '../../App'

const AddNewTicket = ({ isOpen, setIsOpen, addNewType }) => {
    const {currentUserVal} = useContext(UserContext)
    const ticketObj = {
        consultantName: '',
        consultantId:'',
        location: '',
        receivedDate: '',
        targetDate: '',
        assignedDate: '',
        technology: '',
        status: '',
        phone: '',
        assignedTo: {},
        assignedBy: {},
        description: '',
        comments: ''
    }
    const clientObj = {
        consultantName: '',
        location: '',
        companyName: '',
        phone: '',
        technology: '',
        appType: ''
    }
    const ticketSchema = {
        consultantName: Yup.string().required('String required'),
        phone: Yup.string().required('String required'),
        technology: Yup.string().required('String required'),
        targetDate: Yup.string().required('String required'),
        location: Yup.string().required('String required'),
    }
    const clientSchema = {
        consultantName: Yup.string().required('String required'),
        phone: Yup.string().required('String required'),
        technology: Yup.string().required('String required'),
        location: Yup.string().required('String required'),
        companyName: Yup.string().required('String required'),
        appType: Yup.string().required('String required'),
    }
    const [modelType, setModelType] = useState('TICKET')
    const [clientsList, setClientsList] = useState([])
    const [apiError, setApiError] = useState('')
    const getClients = async () => {
        const { data, success } = await fetchGetCall('/api/getclientslist')
        if (success) {
            setClientsList(data)
        }
    }
    useEffect(() => {
        setModelType(addNewType)
        if (addNewType == 'TICKET') {
            console.log(addNewType)
            getClients()
        }
    }, [addNewType])

    const addNewTicket = async (data, { resetForm }) => {
        if (modelType == 'TICKET') {
            data.consultantName = JSON.parse(data.consultantName).consultantName
            const res = await fetchCall('/api/addnewticket', { data })
            if (res._id) {
                setIsOpen(false)
                alert('Ticket added')
            }
            addActivity(currentUserVal, 'Dashboard Page', `New Ticket Added for ${data.consultantName}`)
        }
        if (modelType == 'CLIENT') {
            const res = await fetchCall('/api/addnewclient', { data })
            if (res._id) {
                console.log('CLIENT RES', res)
                setIsOpen(false)
                alert('Client Added')
                addActivity(currentUserVal, 'Dashboard Page', `New Client Added for ${data.consultantName}`)
            } else {
                console.log('RES',res)
                const err = res.includes('E11000') ? 'Try new Phone number' : res
                setApiError(err)
            }
        }
    }
    const handleChange = (e, setVal, values) => {
        console.log('Handle Chnage', e.target.value, values)
        const { name, value } = e.target
        const val = JSON.parse(value)
        if (val.hasOwnProperty('_id')) {
            values.phone = val.phone
            values.location= val.location
            values.technology = val.technology
            values.consultantId = val._id
        }
        setVal(name, value)
    }
    return (
        <Modal isOpen={isOpen} setModal={setIsOpen}>
            <Container>
                <Formik
                    initialValues={modelType == 'TICKET' ? ticketObj : clientObj}
                    onSubmit={addNewTicket}
                    validationSchema={Yup.object().shape(modelType=='TICKET'? ticketSchema: clientSchema)}
                >
                    {
                        ({ values, setFieldValue, errors }) => (
                            <Form>
                                <Row>
                                    {
                                        modelType == 'TICKET' ?
                                            <Field as='select' className='form-control my-1' name='consultantName' onChange={(e) => handleChange(e, setFieldValue, values)} >
                                                {
                                                    ['Select Consultant', ...clientsList].map((client, idx) => (
                                                        <option key={client._id + idx} value={JSON.stringify(client)}>{client?.consultantName}</option>
                                                    ))
                                                }
                                            </Field> :
                                            <Field className="form-control my-1" name='consultantName' placeholder='Consultant name...' />
                                    }
                                    <Field className="form-control my-1" name='phone' placeholder='Phone...' />
                                    <Field className="form-control my-1" name='location' placeholder='Consultant location...' />
                                    <Field className="form-control my-1" name='technology' placeholder='Technology...' />
                                    {
                                        modelType == 'TICKET' ? <>
                                            <label className='form-label my-1' htmlFor='targetDate'>Target Date :</label>
                                            <Field type='date' date={new Date()} id='targetDate' className='form-control my-1' name='targetDate' label='TargetDate' />
                                        </> :
                                            <>
                                                <Field className="form-control my-1" name='companyName' placeholder='Company Name...' />
                                                <Field className="form-control my-1" name='appType' placeholder='Appilcation Type...' />
                                            </>
                                    }

                                </Row>
                                <Row className='mt-3'>
                                    {
                                        modelType == 'TICKET' ? <Button type='submit'>Add Ticket</Button> : <Button type='submit'>Add Client</Button>
                                    }
                                    {
                                        Object.keys(errors).length ? <Col className='text-danger'>Field Required at:  {Object.keys(errors).join(', ')}</Col>: ''
                                    }{
                                        apiError != '' && <Col className='text-danger'> {apiError}</Col>
                                    }
                                </Row>
                            </Form>
                        )
                    }
                </Formik>
            </Container>
        </Modal>
    )
}

export default AddNewTicket