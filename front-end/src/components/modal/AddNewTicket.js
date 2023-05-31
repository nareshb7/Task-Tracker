import React from 'react'
import Modal from './Modal'
import { Button, Container, Row } from 'react-bootstrap'
import { Field, Form, Formik } from 'formik'
import { fetchCall } from '../utils/fetch/UseFetch'

const AddNewTicket = ({isOpen, setIsOpen}) => {
    const obj ={
        consultantName: '',
        location:'',
        receivedDate:'',
        targetDate:'',
        assignedDate:'',
        technology:'',
        status:'',
        phone:'',
        assignedTo:{},
        assignedBy: {},
        description:'',
        comments:''
    }

    const addNewTicket =async (data, {resetForm})=> {
        console.log(data, 'FormData')
        const res = await fetchCall('/api/addnewticket', {data})
        if(res._id) {
            setIsOpen(false)
        }
    }
  return (
    <Modal isOpen={isOpen} setModal={setIsOpen}>
        <Container>
            <Formik
                initialValues={obj}
                onSubmit={addNewTicket}
            >
                {
                    ({values})=> (
                        <Form>
                            <Row>
                            <Field className="form-control" name='consultantName' placeholder='Consultant name...' />
                            <Field className="form-control" name='phone' placeholder='Phone...' />
                            <Field className="form-control" name='location' placeholder='Consultant location...' />
                            <Field className="form-control" name='technology' placeholder='Technology...' />
                            <label className='form-label' for='targetDate'>Target Date :</label>
                            <Field type='date' mindate={new Date()} id='targetDate' className='form-control' name='targetDate' label='TargetDate' />
                            </Row>
                            <Row>
                                <Button type='submit'>Add</Button>
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