import React, { useContext, useEffect, useState } from 'react'
import { Col, Container, Row, Table } from 'react-bootstrap'
import { useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from '../../App'
import { fetchGetCall } from '../../components/utils/fetch/UseFetch'
import { getFullName } from '../../components/utils/GetFullName'
import { addActivity } from '../activityPage/ActivityPage'
import { dateIndicator } from '../chatBox/MessageBox'
import './clientStats.css'

const ClientStats = () => {
    const {state} = useLocation()
    const navigate = useNavigate()
    const {currentUserVal} = useContext(UserContext)
    const [clientData, setClientData] = useState(state)
    const [clientTickets, setClientTickets] = useState([])
    console.log('STATTE', state)
    const getClientData =async ()=> {
        const tickets = await fetchGetCall('/api/getclienttickets', {id: state._id})
        if (tickets.success) {
            setClientTickets(tickets.data)
        }
        console.log('CLIENT RES', tickets)
    }
    const gotoDesc = (val) => {
        navigate(`/description`, { state: val })
    }
    useEffect(()=> {
        getClientData()
        addActivity(currentUserVal, 'Client Stats page', `Visited ${state.consultantName} client stats Page `)
    },[])
  return (
    <Container fluid className='card shadow my-2'>
        <Row><span className='fw-bolder fs-3'>Client Data: </span></Row>
        <Row className='flex-column fw-bold'>
            <Col><span className='fs-5'>Name: </span><span className='fst-italic'>{clientData.consultantName} -{clientData._id}</span></Col>
            <Col><span className='fs-5'>Location: </span><span className='fst-italic'>{clientData.location}</span></Col>
            <Col><span className='fs-5'>Phone: </span><span className='fst-italic'>{clientData.phone}</span></Col>
            <Col><span className='fs-5'>Email: </span><span className='fst-italic'>{clientData.email}</span></Col>
            <Col><span className='fs-5'>Company Name: </span><span className='fst-italic'>{clientData.companyName}</span></Col>
            <Col><span className='fs-5'>Technology: </span><span className='fst-italic'>{clientData.technology}</span></Col>
            <Col><span className='fs-5'>Application Type: </span><span className='fst-italic'>{clientData.appType}</span></Col>
            <Col><span className='fs-5'>Joinede Date: </span><span className='fst-italic'>{dateIndicator(clientData.createdAt)}</span></Col>

        </Row>
        <Row>
            <Col className='fw-bolder fs-3'>Total Tickets: {clientTickets.length}</Col>
            {
                clientTickets?.length && <Table striped hover className='clientStats-table'>
                <thead class='table-head'>
                    <tr>
                        <th>Sl. no</th>
                        <th>Developer Name</th>
                        <th>Helped Developer</th>
                        <th>Requirement</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody className='table-body'>
                    {
                        clientTickets.map((tkt, idx)=> {
                            return <tr onClick={()=> gotoDesc(tkt)}>
                                <td>{idx +1}</td>
                                <td>{tkt.dName}</td>
                                <td>{JSON.parse(tkt.helpedDev).name}</td>
                                <td>{tkt.issue}</td>
                                <td>{tkt.issueStatus}</td>
                                <td>{dateIndicator(tkt.time)}</td>
                            </tr>
                        })
                    }
                </tbody>
            </Table>
            }
                
        </Row>
    </Container>
  )
}

export default ClientStats