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
    <Container fluid>
        <Row className='flex-column'>
            <Col><span>Client Name: </span><span>{clientData.consultantName} -{clientData._id}</span></Col>
            <Col><span>Location: </span><span>{clientData.location}</span></Col>
            <Col><span>Phone: </span><span>{clientData.phone}</span></Col>
            <Col><span>Email: </span><span>{clientData.email}</span></Col>
            <Col><span>Company Name: </span><span>{clientData.companyName}</span></Col>
            <Col><span>Technology: </span><span>{clientData.technology}</span></Col>
            <Col><span>Application Type: </span><span>{clientData.appType}</span></Col>

        </Row>
        <Row>
            <Col className='fw-bolder fs-3'>Total Tickets: {clientTickets.length}</Col>
                <Table>
                    <thead>
                        <tr>
                            <th>Sl. no</th>
                            <th>Developer Name</th>
                            <th>Helped Developer</th>
                            <th>Requirement</th>
                            <th>Status</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
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
        </Row>
    </Container>
  )
}

export default ClientStats