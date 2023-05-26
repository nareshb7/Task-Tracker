import React, { useState } from 'react'
import Modal from '../../components/modal/Modal'
import { Button, Card, Col, Container, Row } from 'react-bootstrap'
import { fetchCall } from '../../components/utils/fetch/UseFetch'

const ContactUs = () => {
    const [isOpen,setIsOpen] = useState(true)
    const [data,setData] = useState({
        name:'',
        email:'',
        desc:''
    })
    const handleChange = (e)=> {
        const {name,value} = e.target
        setData({...data, [name]: value})
    }
    const handleSubmit =async ()=> {
        console.log('Submitted',data)
        alert('Submitted')
        const result = await fetchCall('/api/addcontactus', {data})
        console.log('REs',result)
    }
  return (
    <Card className='my-1 p-3 m-auto' style={{backgroundColor: '#85d0dc', width:'500px'}}>
        <Row>
            <Col className='fw-bold fs-2 text-center'> Contact Us </Col>
            <hr/>
        </Row>
        <Row className='d-flex flex-column gap-2' >
            <Col>
                <input type='text' name='name' value={data.name} className='form-control' placeholder='Enter Your name...' onChange={handleChange}/>
            </Col>
            <Col>
                <input type='email' name='email' value={data.email} className='form-control' placeholder='Enter your mail address..' onChange={handleChange}/>
            </Col>
            <Col>
                <textarea value={data.desc} className='form-control' name='desc' placeholder='Description...' rows="4" cols="50" onChange={handleChange}></textarea>
            </Col>
            <Col>
                <Button onClick={handleSubmit}>Submit</Button>
            </Col>
        </Row>
    </Card>
  )
}

export default ContactUs