import React, { useEffect, useState } from 'react'
import { Col, Container, Row, Table } from 'react-bootstrap'
import { fetchGetCall } from '../../components/utils/fetch/UseFetch'

const ContactUsAdmin = () => {
    const [messages, setMessages] = useState([])
    const getData =async ()=> {
        const {success,data} = await fetchGetCall('/api/contactusmessage')
        if(success) {
            setMessages(data)
        }
    }

    useEffect(()=> {
        getData()
    },[])
  return (
    <Container>
        <Row>
            <Col className='fw-bold text-center fs-3'>Contacted Persons</Col>
            <hr/>
        </Row>
        <Table striped hover bordered>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Description</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
                {
                    messages.map((msz)=> (
                        <tr key={msz._id}>
                            <td>{msz.name}</td>
                            <td> <a href={`mailto:${msz.email}`} >{msz.email}</a></td>
                            <td>{msz.desc}</td>
                            <td>{new Date(msz.createdAt).toLocaleString()}</td>
                        </tr>
                    ))
                }
            </tbody>
        </Table>
    </Container>
  )
}

export default ContactUsAdmin