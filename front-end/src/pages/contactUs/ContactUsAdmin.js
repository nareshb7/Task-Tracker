import React, { useContext, useEffect, useState } from 'react'
import { Col, Container, Row, Table } from 'react-bootstrap'
import { fetchGetCall } from '../../components/utils/fetch/UseFetch'
import { UserContext } from '../../App'
import { addActivity } from '../activityPage/ActivityPage'
import TaskTable from '../../components/reusable/table/Table'

const ContactUsAdmin = () => {
    const [messages, setMessages] = useState([])
    const {currentUserVal} = useContext(UserContext)
    const getData =async ()=> {
        const {success,data} = await fetchGetCall('/api/contactusmessage')
        if(success) {
            setMessages(data)
        }
    }

    useEffect(()=> {
        addActivity(currentUserVal, 'Contact Us page', `Visited Contact us Page`)
        getData()
    },[])
    const headers = [
        {title: 'Name', key: 'name'},
        {title: 'Email', key: 'email', tdformat : (msz)=> <a href={`mailto:${msz.email}`} >{msz.email}</a>},
        {title: 'Description', key:'desc'},
        {title: 'Time', key:'createdAt', tdformat: (msz)=> <span>{new Date(msz.createdAt).toLocaleString()}</span>}
    ]
  return (
    <Container>
        <Row>
            <Col className='fw-bold text-center fs-3'>Contacted Persons</Col>
            <hr/>
        </Row>
        <TaskTable 
        tableData={messages} 
        headers={headers} 
        handleRowClick={(val)=> console.log('ADMIN REQ', val)}
        />
    </Container>
  )
}

export default ContactUsAdmin