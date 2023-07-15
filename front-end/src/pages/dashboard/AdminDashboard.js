import React, { useEffect, useState } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { fetchCall, fetchDeletecall, fetchGetCall } from '../../components/utils/fetch/UseFetch'
import UserDashboard from './UserDashboard'
import AssignTicketModal from '../../components/modal/AssignTicket'
import AddNewTicket from '../../components/modal/AddNewTicket'
import { addActivity } from '../activityPage/ActivityPage'
import UpdateSheet from './UpdateSheet'
import TaskTable from '../../components/reusable/table/Table'
import { setTrBg } from '../../components/utils/Util'
import DashboardTicketData from './DashboardTicketData'


const AdminDashboard = ({ currentUserVal, socket }) => {
    const [isAdminDashboard, setIsAdminDashboard] = useState('UPDATESHEET')
    const [modelOpen, setModelOpen] = useState(false)
    const [openNewTicketModal, setOpenNewTicketModal] = useState(false)
    const [selectedDev, setSelectedDev] = useState('')
    const [addNewType, setNewType] = useState('')
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
        const res = await fetchGetCall('/api/todaytickets')
        if (res.success) {
            // Today Tickets 
            console.log('Today::', res.data)
            const total = res.data
            const resolved = res.data.filter(tkt => tkt.status == "Resolved").length
            const pending = res.data.filter(tkt => tkt.status == "Pending").length
            const assigned = res.data.filter(tkt => tkt.status !== "").length
            const percentage = (resolved / total.length * 100).toFixed(2)
            setTodayTickets({ total, resolved, pending, assigned, percentage })
        }
    }
    useEffect(() => {

        const getTotalTickets = async () => {
            // Total Tickets 
            const res = await fetchGetCall('/api/getData', {})
            if (res.success) {
                const total = res.data
                const resolved = res.data.filter(tkt => tkt.issueStatus == "Resolved").length
                const pending = res.data.filter(tkt => tkt.issueStatus == "Pending").length
                const fixed = res.data.filter(tkt => tkt.issueStatus == "Fixed").length
                const percentage = (resolved / total.length * 100).toFixed(2)
                setTicketsData({ total, resolved, pending, fixed, percentage })
            }
        }
        addActivity(currentUserVal, 'Admin Dashboard page', `Visited Dashboard Page`)
        getTotalTickets()
    }, [])

    const selectDev = (ticketData) => {
        setModelOpen(true)
        setSelectedTicket(ticketData)
    }
    const assignTicket = async () => {
        console.log('Selectd Dev: ', selectedDev, selectedTicket)
        if (currentUserVal._id == '63ebcf33b9e7c974480c71f3' && selectedDev._id) {
            selectedTicket['assignedBy'] = { id: currentUserVal._id, name: currentUserVal.fName + " " + currentUserVal.lName }
            const updateTicket = await fetchCall('/api/updateticket', { id: selectedTicket._id, selectedDev, selectedTicket })
            console.log('UpdateTicket', updateTicket)
            await getTodayTickets()
            const val = { fName: currentUserVal.fName, lName: currentUserVal.lName, id: currentUserVal._id }
            socket.emit('AssignTicket', 'TicketAssign', selectedDev._id, val)
            setModelOpen(false)
            alert('Ticket Assigned ')
            setSelectedTicket({})
            setSelectedDev('')
            addActivity(currentUserVal, 'Admin Dashboard page', `Assgined Ticket to ${selectedDev.name}`)
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
    const addNewTickets = (type) => {
        setNewType(type)
        setOpenNewTicketModal(true)
    }
    const deleteTicket = async () => {
        const cnfrm = window.confirm(`Do u want to delete ${selectedTicket.consultantName} ticket??`)
        if (cnfrm) {
            const result = await fetchDeletecall('/api/deleteticket', { id: selectedTicket._id })
            if (result._id) {
                setModelOpen(false)
                getTodayTickets()
                alert('Deleted Successfully')
                addActivity(currentUserVal, 'Admin Dashboard page', `Ticket Deleted  ${selectedTicket.consultantName}`)
            }
        }
    }
    useEffect(() => {
        getTodayTickets()
    }, [openNewTicketModal])
    const headers = [
        { title: 'Sl.No', key: "serialNo" },
        { title: 'Consultant', key: "consultantName" },
        { title: 'Phone', key: "phone" },
        { title: 'Status', key: "status", tdFormat: (ticket) => <span>{ticket.status ? ticket.status : "Not assigned"}</span> },
        { title: 'Assigned to', key: "assignedTo", tdFormat: (ticket) => <span>{ticket.assignedTo ? ticket.assignedTo.name : "Null"}</span> },
        { title: 'Helped Dev', key: "helpedDev.name" },
        { title: 'Location', key: "location" },
        { title: 'Received Date', key: "receivedDate", tdFormat: (ticket) => <span>{dateFormatter(ticket.receivedDate)}</span> },
        { title: 'Assigned Date', key: "assignedDate", tdFormat: (ticket) => <span>{dateFormatter(ticket.assignedDate)}</span> },
        { title: 'Target Date', key: "targetDate", tdFormat: (ticket) => <span>{dateFormatter(ticket.targetDate)}</span> },
        { title: 'Completed Date', key: "completedDate", tdFormat: (ticket) => <span>{dateFormatter(ticket.completedDate)}</span> },
        { title: 'Technology', key: "technology" },
        { title: 'Task Description', key: "descriptions", tdFormat: (ticket) => <span>{ticket.descriptions?.slice(0, 10)}...</span> },
        { title: 'Comments', key: "comments", tdFormat: (ticket) => <span>{ticket.comments?.slice(0, 20)}</span> },
    ]

    return <Row>
        <Col>
            <Button onClick={() => setIsAdminDashboard(true)}>Admin Dashboard</Button>
        </Col>
        <Col>
            <Button onClick={() => setIsAdminDashboard(false)}>Update Sheet</Button>
        </Col>
        {
            isAdminDashboard ? <Col>
                <p>Admin Dashboard</p>
                <DashboardTicketData addNewTickets={addNewTickets} employeesdata={employeesdata} ticketsData={ticketsData} todayTickets={todayTickets} />
                <Row>
                    <Col className='card my-3' style={{ height: '500px' }}>
                        <span className='fs-3 fw-bold' >Today Tickets : {todayTickets.total.length}</span>
                        <Col className='container-fluid m-auto text-center' style={{ overflow: 'scroll', position: 'relative' }}>
                            <TaskTable tHeadClassName='todayTickets-thead' headers={headers} tableData={todayTickets.total} handleRowClick={(ticket) => selectDev(ticket)} />
                        </Col>
                    </Col>
                </Row>
                <AddNewTicket isOpen={openNewTicketModal} setIsOpen={setOpenNewTicketModal} addNewType={addNewType} />
                <AssignTicketModal
                    modelOpen={modelOpen}
                    setModelOpen={setModelOpen}
                    selectedDev={selectedDev}
                    selectedTicket={selectedTicket}
                    assignTicket={assignTicket}
                    cancelTicket={cancelTicket}
                    employeesdata={employeesdata}
                    setSelectedDev={setSelectedDev}
                    getTodayTickets={getTodayTickets}
                    deleteTicket={deleteTicket}
                />
            </Col> : <UpdateSheet currentUserVal={currentUserVal} todayTickets={todayTickets} />
        }
    </Row>

}
export default AdminDashboard

/* 
<Table className='striped ticketsTable'>
                                <thead style={{ position: 'sticky' }}>
                                    <tr>
                                        <th>Sl.NO</th>
                                        <th>Consultant</th>
                                        <th>Phone</th>
                                        <th>Status</th>
                                        <th>Assigned to</th>
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
                                                <td>{ticket.status ? ticket.status : "Not assigned"}</td>
                                                <td>{ticket.assignedTo ? ticket.assignedTo.name : "Null"}</td>
                                                <td>{ticket.helpedDev?.name}</td>
                                                <td>{ticket.location}</td>
                                                <td>{dateFormatter(ticket.receivedDate)}</td>
                                                <td>{dateFormatter(ticket.assignedDate)}</td>
                                                <td>{dateFormatter(ticket.targetDate)}</td>
                                                <td>{dateFormatter(ticket.completedDate)}</td>
                                                <td>{ticket.technology}</td>
                                                <td><span>{ticket.descriptions?.slice(0, 10)}...</span></td>
                                                <td><span style={{textOverflow:'ellipsis', }}>{ticket.comments?.slice(0, 20)}</span></td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </Table>
*/