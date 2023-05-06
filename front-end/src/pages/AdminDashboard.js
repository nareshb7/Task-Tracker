import React, { useEffect, useState } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { fetchCall, fetchGetCall } from '../components/utils/fetch/UseFetch'
import Modal from '../components/modal/Modal'


const AdminDashboard = ({ currentUserVal, socket }) => {

    const [todayTickets, setTodayTickets] = useState([])
    const [modelOpen, setModelOpen] = useState(false)
    const [selectedDev, setSelectedDev] = useState('')
    const [selectedTicket, setSelectedTicket] = useState({})
    const [employeesdata, setEmployeesdata] = useState({
        employees: [],
        total: 0,
        active: 0,
        offline: 0,
        percentage: 0
    })
    const [ticketsData, setTicketsData] = useState({
        total: 15,
        assigned: 12,
        resolved: 10,
        pending: 5,
        percentage: 65
    })

    socket.off('new-user').on('new-user', (employees) => {
        const total = employees.length
        const active = employees.filter(user => user.status == "Online").length
        const offline = employees.filter(user => user.status == "Offline").length
        const percentage = (active / total * 100).toFixed(2)
        setEmployeesdata({ total, active, offline, employees, percentage })
    })
    useEffect(() => {
        socket.emit('new-user')
    }, [])
    useEffect(() => {
        const getTickets = async () => {
            const tickets = await fetchGetCall('/api/todaytickets')
            console.log('Tickets', tickets)
            if (tickets.length) setTodayTickets(tickets)
        }
        getTickets()
    }, [])

    const selectDev = (ticketData) => {
        setModelOpen(true)
        setSelectedTicket(ticketData)
        console.log('selected Tkt::', ticketData)
    }
    const assignTicket = async () => {
        console.log('Selectd Dev: ', selectedDev, selectedTicket)
        selectedTicket['assignedBy'] = currentUserVal.fName +" "+ currentUserVal.lName
        const assignTickets = await fetchCall('/api/assignticket', { id: selectedDev._id, ticket: selectedTicket, })
        console.log('Assign Res', assignTickets)
        if (assignTickets == 'Assigned') {
            setModelOpen(false)
            alert('Ticket Assigned ')
            setSelectedTicket({})
            setSelectedDev('')
        }
    }
    const cancelTicket = () => {
        console.log('clicked cancel')
        setModelOpen(false)
        setSelectedTicket({})
        setSelectedDev('')
    }
    return <Col>
        <p>Admin Dashboard</p>
        <Row className='d-flex m-2 gap-3 fw-bolder'>
            <Col className='card bg-primary '>
                <span className='fs-4 px-1'>Total Employees: </span>
                <span className='fs-1 text-start'>{employeesdata.total}</span>
            </Col>
            <Col className='card bg-success'>
                <span className='fs-4 px-1'>Active Employees: </span>
                <span className='fs-1 text-start'>{employeesdata.active}</span>
            </Col>
            <Col className='card bg-info'>
                <span className='fs-4 px-1'>Offline Employees: </span>
                <span className='fs-1 text-start'>{employeesdata.offline}</span>
            </Col>
            <Col className='card bg-warning'>
                <span className='fs-4 px-1'>Active Percentage: </span>
                <span className='fs-1 text-start'>{employeesdata.percentage}%</span>
            </Col>
        </Row>
        <Row className='d-flex m-2 gap-3 fw-bolder'>
            <Col className='card bg-primary'>
                <span className='fs-3 px-1'>Total Tickets :</span>
                <span className='fs-1 text-start'>{ticketsData.total}</span>
            </Col>
            <Col className='card bg-success'>
                <span className='fs-3 px-1'>Resolved Tickets :</span>
                <span className='fs-1 text-start'>{ticketsData.resolved}</span>
            </Col>
            <Col className='card bg-info'>
                <span className='fs-3 px-1'>Pending Tickets :</span>
                <span className='fs-1 text-start'>{ticketsData.pending}</span>
            </Col>
            <Col className='card bg-warning'>
                <span className='fs-3 px-1'>Percentage: </span>
                <span className='fs-1 text-start'>{ticketsData.percentage}%</span>
            </Col>
        </Row>
        <Row>
            <Col className='card my-3' style={{ height: '400px' }}>
                <span className='fs-3 fw-bold' >Today Tickets : </span>
                <Col className='container-fluid m-auto text-center' style={{ overflowY: 'scroll' }}>
                    <Table className='striped ticketsTable'>
                        <thead>
                            <tr>
                                <th>Sl.NO</th>
                                <th>Consultant</th>
                                <th>Assigned to</th>
                                <th>Status</th>
                                <th>Helped Dev</th>
                                <th>Location</th>
                                <th>Received Date</th>
                                <th>Assigned Date</th>
                                <th>Target Date</th>
                                <th>Completed Date</th>
                                <th>Technology</th>
                                <th>Task Description</th>
                                <th>Comments</th>
                                <th>Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                todayTickets.map((ticket, idx) => (
                                    <tr key={idx + Math.random()} onClick={() => selectDev(ticket)}>
                                        <td>{idx + 1}.</td>
                                        <td>{ticket.name}</td>
                                        <td>{currentUserVal.fName}</td>
                                        <td>Not assigned</td>
                                        <td>Sai</td>
                                        <td>{ticket.location}</td>
                                        <td>{new Date(ticket.receivedDate).toLocaleDateString()}</td>
                                        <td>{new Date().toLocaleDateString()}</td>
                                        <td>{new Date(new Date().setDate(+5)).toLocaleDateString()}</td>
                                        <td>{new Date().toLocaleDateString()}</td>
                                        <td>{ticket.technology}</td>
                                        <td>Description</td>
                                        <td>Comments</td>
                                        <td>{ticket.phn}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </Col>
            </Col>
        </Row>
        {
            <Modal isOpen={modelOpen} setModal={setModelOpen}>
                <Row>
                    <Col style={{ width: "300px" }} >
                        <div>
                            <span className='fs-4 fw-bold'>Consultant :</span>
                            <span className='fs-4 fst-italic'> {selectedTicket.name}</span>
                        </div>
                        <div>
                            <span className='fs-4 fw-bold'> Technology:</span>
                            <span className='fs-4 fst-italic'> {selectedTicket.technology}</span>
                        </div>
                        <div>
                            <span className='fs-4 fw-bold'>Select Developer: </span>
                            <select className='form-control fst-italic' defaultValue={selectedDev} onChange={(e) => setSelectedDev(JSON.parse(e.target.value))}>
                                {
                                    employeesdata.employees.map((val, idx) => {
                                        return <option key={idx + Math.random()} value={JSON.stringify(val)}>{val.fName} {val.lName}</option>
                                    })
                                }
                            </select>
                        </div>
                        <div className='d-flex justify-content-around my-2'>
                            <Button onClick={assignTicket}>Assign</Button>
                            <Button onClick={cancelTicket} variant='warning'>Cancel</Button>
                        </div>
                    </Col>
                </Row>
            </Modal>
        }

    </Col>
}
export default AdminDashboard