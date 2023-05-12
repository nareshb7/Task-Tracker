import React, { useEffect, useState } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { fetchCall, fetchGetCall } from '../components/utils/fetch/UseFetch'
import Modal from '../components/modal/Modal'
import UserDashboard from './UserDashboard'

export const setTrBg = (type, date) => {
    let bg;
    const today = new Date().toLocaleDateString()
    const targetDate = new Date(date).toLocaleDateString()
    const deadLine = new Date(today) >= new Date(targetDate)
    switch (type) {
        case "Assigned": {
            bg = 'primary'
            break;
        }
        case "Resolved": {
            bg = 'success'
            break;
        }
        case "Pending": {
            bg = 'warning'
            break;
        }
        default: {
            bg = ''
        }
    }
    if (!bg  && deadLine) {
        return `bg-danger`
    }
    return `bg-${bg}`
}

const AdminDashboard = ({ currentUserVal, socket }) => {
    const [isAdminDashboard,setIsAdminDashboard] = useState(true)
    const [modelOpen, setModelOpen] = useState(false)
    const [selectedDev, setSelectedDev] = useState('')
    const [selectedTicket, setSelectedTicket] = useState({})
    const [todayTickets, setTodayTickets] = useState({
        total: [],
        assigned: 0,
        resolved: 0,
        pending: 0,
        percentage: 0
    })
    const [employeesdata, setEmployeesdata] = useState({
        employees: [],
        total: 0,
        active: 0,
        offline: 0,
        percentage: 0
    })
    const [ticketsData, setTicketsData] = useState({
        total: 15,
        fixed: 12,
        resolved: 10,
        pending: 5,
        percentage: 65
    })

    socket.off('new-user').on('new-user', (employees) => {
        // Employees data
        const total = employees.length
        const active = employees.filter(user => user.status == "Online").length
        const offline = employees.filter(user => user.status == "Offline").length
        const percentage = (active / total * 100).toFixed(2)
        setEmployeesdata({ total, active, offline, employees, percentage })
    })
    useEffect(() => {
        socket.emit('new-user')
    }, [])
    const getTodayTickets = async () => {
        const tickets = await fetchGetCall('/api/todaytickets')
        if (tickets.length) {
            // Today Tickets 
            console.log('Today::', tickets)
            const total = tickets
            const resolved = tickets.filter(tkt => tkt.status == "Resolved").length
            const pending = tickets.filter(tkt => tkt.status == "Pending").length
            const assigned = tickets.filter(tkt => tkt.status !== "").length
            const percentage = (resolved / total.length * 100).toFixed(2)
            setTodayTickets({ total, resolved, pending, assigned, percentage })
        }
    }
    useEffect(() => {

        const getTotalTickets = async () => {
            // Total Tickets 
            const res = await fetchGetCall('/api/getData', {})
            if (res.length) {
                const total = res
                const resolved = res.filter(tkt => tkt.issueStatus == "Resolved").length
                const pending = res.filter(tkt => tkt.issueStatus == "Pending").length
                const fixed = res.filter(tkt => tkt.issueStatus == "Fixed").length
                const percentage = (resolved / total.length * 100).toFixed(2)
                setTicketsData({ total, resolved, pending, fixed, percentage })
            }
        }
        getTotalTickets()
        getTodayTickets()
    }, [])

    const selectDev = (ticketData) => {
        setModelOpen(true)
        setSelectedTicket(ticketData)
    }
    const assignTicket = async () => {
        console.log('Selectd Dev: ', selectedDev, selectedTicket)
        if (currentUserVal._id == '63ebcf33b9e7c974480c71f3' && selectedDev._id) {

            selectedTicket['assignedBy'] = {id: currentUserVal._id, name: currentUserVal.fName + " " + currentUserVal.lName}
            const updateTicket = await fetchCall('/api/updateticket', { id: selectedTicket._id, selectedDev, selectedTicket })
            console.log('UpdateTicket', updateTicket)
            await getTodayTickets()
            const val = { fName: currentUserVal.fName, lName: currentUserVal.lName, id: currentUserVal._id }
            socket.emit('AssignTicket', 'TicketAssign', selectedDev._id, val)
                setModelOpen(false)
                alert('Ticket Assigned ')
                setSelectedTicket({})
                setSelectedDev('')
            
        } else {
            alert('You cannot assign ')
        }
    }
    const cancelTicket = () => {
        console.log('clicked cancel')
        setModelOpen(false)
        setSelectedTicket({})
        setSelectedDev('')
    }
    const dateFormatter = (data) => {
        if (!data) return "---"
        return new Date(data).toLocaleDateString()
    }
    

    return <Row>
        <Col>
            <Button onClick={()=> setIsAdminDashboard(false)}>User Dashboard</Button>
        </Col>
        <Col>
            <Button onClick={()=> setIsAdminDashboard(true)}>Admin Dashboard</Button>
        </Col>
        {
            isAdminDashboard ? <Col>
            <p>Admin Dashboard</p>
            {/* Employess Data */}
            <Row className='d-flex m-2 gap-3 fw-300'>
                <Col className='card bg-primary'>
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
            {/* Total Tickets data */}
            <Row className='d-flex m-2 gap-3 fw-300'>
                <Col className='card bg-primary'>
                    <span className='fs-3 px-1'>Total Tickets :</span>
                    <span className='fs-1 text-start'>{ticketsData.total.length}</span>
                </Col>
                <Col className='card bg-success'>
                    <span className='fs-3 px-1'>Fixed Tickets :</span>
                    <span className='fs-1 text-start'>{ticketsData.fixed}</span>
                </Col>
                <Col className='card bg-secondary'>
                    <span className='fs-3 px-1'>Resolved Tickets:</span>
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
            {/* Today Tickets data */}
            <Row className='d-flex m-2 gap-3 fw-bold'>
                <Col className='card bg-primary'>
                    <span className='fs-3 px-1'>Today Tickets: </span>
                    <span className='fs-1 text-start'>{todayTickets.total.length}</span>
                </Col>
                <Col className='card bg-success'>
                    <span className='fs-3 px-1'>Assigned: </span>
                    <span className='fs-1 text-start'>{todayTickets.assigned}</span>
                </Col>
                <Col className='card bg-info'>
                    <span className='fs-3 px-1'>Resolved: </span>
                    <span className='fs-1 text-start'>{todayTickets.resolved}</span>
                </Col>
                <Col className='card bg-warning'>
                    <span className='fs-3 px-1'>Pending: </span>
                    <span className='fs-1 text-start'>{todayTickets.pending}</span>
                </Col>
                <Col className='card bg-info'>
                    <span className='fs-3 px-1'>Percentage: </span>
                    <span className='fs-1 text-start'>{todayTickets.percentage}%</span>
                </Col>
            </Row>
            {/* Maping today tickets into a table */}
            <Row>
                <Col className='card my-3' style={{ height: '400px' }}>
                    <span className='fs-3 fw-bold' >Today Tickets : </span>
                    <Col className='container-fluid m-auto text-center' style={{ overflow: 'hidden scroll' }}>
                        <Table className='striped ticketsTable'>
                            <thead>
                                <tr>
                                    <th>Sl.NO</th>
                                    <th>Consultant</th>
                                    <th>Phone</th>
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
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    todayTickets.total.map((ticket, idx) => (
                                        <tr key={idx + Math.random()} onClick={() => selectDev(ticket)} className={setTrBg(ticket.status, ticket.targetDate)}>
                                            <td>{idx + 1}.</td>
                                            <td>{ticket.consultantName}</td>
                                            <td>{ticket.phone}</td>
                                            <td>{ticket.assignedTo ? ticket.assignedTo.name : "Null"}</td>
                                            <td>{ticket.status ? ticket.status : "Not assigned"}</td>
                                            <td>{ticket.helpedDev?.name}</td>
                                            <td>{ticket.location}</td>
                                            <td>{dateFormatter(ticket.receivedDate)}</td>
                                            <td>{dateFormatter(ticket.assignedDate)}</td>
                                            <td>{dateFormatter(ticket.targetDate)}</td>
                                            <td>{dateFormatter(ticket.completedDate)}</td>
                                            <td>{ticket.technology}</td>
                                            <td>{ticket.description}</td>
                                            <td>{ticket.comments}</td>
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
                                <span className='fs-4 fst-italic'> {selectedTicket.consultantName}</span>
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

        </Col> : <UserDashboard currentUserVal={currentUserVal}/>
        }
        
    </Row>

}
export default AdminDashboard