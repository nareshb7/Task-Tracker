import React, { useEffect, useState } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { uploadedIssues } from '../../components/issues/UserIssues'
import { useNavigate } from 'react-router-dom'
import { fetchCall, fetchGetCall } from '../../components/utils/fetch/UseFetch'
import { setTrBg } from './AdminDashboard'
import { addActivity } from '../activityPage/ActivityPage'

export const getTodayTicketsFunc = async (id) => {
    const resp = await fetchGetCall('/api/gettodayticket', { id })
    return resp
}

const UserDashboard = ({ currentUserVal }) => {
    const navigate = useNavigate()
    const [dashboardData, setDashboardData] = useState({
        totalIssues: [],
        resolved: 0,
        pending: 0,
        fixed: 0,
        todayTickets: []
    })
    
    useEffect(() => {
        const getIssues = async () => {
            const totalIssues = await uploadedIssues(currentUserVal._id)
            const resolved = totalIssues.filter(issue => issue.issueStatus == 'Resolved').length
            const pending = totalIssues.filter(issue => issue.issueStatus == 'Pending').length
            const fixed = totalIssues.filter(issue => issue.issueStatus == 'Fixed').length
            const { success, data } = await getTodayTicketsFunc(currentUserVal._id)
            const todayTickets = success && data.filter(tkt => {
                const d1 = new Date(tkt.assignedDate).toDateString()
                const d2 = new Date().toDateString()
                if (d1 == d2) {
                    return tkt
                }
            })
            setDashboardData({ totalIssues, resolved, pending, fixed, todayTickets: data })
        }
        addActivity(currentUserVal, 'Dashboard page', `Visited Dashboard page`)
        getIssues()
    }, [])
    const updateIssue = async (tkt) => {
        const { success, data } = await fetchGetCall('/api/getticketid', { id: tkt._id })
        if (success && data?.length) {
            navigate('/addIssue', { state: { data: data[0], mode: 'UPDATE' } })
        } else {
            navigate('/addIssue', { state: { technology: tkt.technology,consultantId: tkt.consultantId, cName: tkt.consultantName, id: tkt._id } })
        }
        addActivity(currentUserVal, 'Dashboard page', `clicked on update issue for ${tkt.consultantName}`)
    }
    const selectWorkingTicket = async (tkt) => {
        const cnfrm = window.confirm(`Do u want to work on ${tkt.consultantName}'s ticket??`)
        if (cnfrm) {
            const selectedDev = { name: currentUserVal.fName + ' ' + currentUserVal.lName, id: currentUserVal._id }
            const response = await fetchCall('/api/updateticket', { obj: { status: 'In Progress' }, id: tkt._id, from: 'UD', selectedDev })
            if (!response?._id) {
                alert('You already working on one ticket please update that')
                return
            } else {
                addActivity(currentUserVal, 'Dashboard page', `Ticket status Updated`)
            }
            const { success, data } = await getTodayTicketsFunc()
            if (success) {
                setDashboardData({ ...dashboardData, todayTickets: data })
            }
        }
    }
    console.log('Current User Dashboard::', currentUserVal)
    return <Row>
        <Col >
            <p className='text-center fw-bold fs-3 card m-3'>User DashBoard</p>
            <Row className='d-flex gap-3 m-1'>
                <Col className='card bg-primary'>
                    <span className='fw-bolder fs-3 px-1'>Uploaded Issues</span>
                    <span className='fw-bolder fs-1 text-start px-2'>{dashboardData.totalIssues.length}</span>
                </Col>
                <Col className='card bg-secondary'>
                    <span className='fw-bolder fs-3 px-1'>Resolved Issues</span>
                    <span className='fw-bolder fs-1 text-start px-2'>{dashboardData.resolved}</span>
                </Col>
                <Col className='card bg-warning'>
                    <span className='fw-bolder fs-3'>Pending Issues</span>
                    <span className='fw-bolder fs-1 text-start px-2'>{dashboardData.pending}</span>
                </Col>
                <Col className='card bg-success'>
                    <span className='fw-bolder fs-3'>Fixed Issues</span>
                    <span className='fw-bolder fs-1 text-start px-2'>{dashboardData.fixed}</span>
                </Col>
            </Row>
            <Row>
                <Row>
                    <Col><span className='fs-5 fw-bold'>Today Tickets : </span><span className='fs-3 fw-bold'>{dashboardData.todayTickets.length}</span></Col>
                    <Col><span className='fs-5 fw-bold'>Raised Tickets : </span><span className='fs-3 fw-bold'> 5</span></Col>
                </Row>
                <Row>
                    {
                        dashboardData.todayTickets.length && <Table>
                            <thead>
                                <tr>
                                    <th>Client </th>
                                    <th>Phone</th>
                                    <th>Technology</th>
                                    <th>AssignedBy</th>
                                    <th>Assigned Time</th>
                                    <th>Status</th>
                                    <th>Update</th>
                                    <th>Working On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dashboardData.todayTickets.map((tkt, idx) => {
                                        return <tr key={idx + Math.random()} className={setTrBg(tkt.status)} >
                                            <td>{tkt.consultantName}</td>
                                            <td>{tkt.phone}</td>
                                            <td>{tkt.technology}</td>
                                            <td>{tkt.assignedBy?.name}</td>
                                            <td> {new Date(tkt.assignedDate).toLocaleString()}</td>
                                            <td>{tkt.status}</td>
                                            <td><Button onClick={() => updateIssue(tkt)}>Update</Button></td>
                                            <td><Button onClick={() => selectWorkingTicket(tkt)} disabled={tkt.status == 'In Progress'}>{tkt.status == 'In Progress' ? 'Selected' : 'Select'}</Button> </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </Table>
                    }
                </Row>
            </Row>
        </Col>
    </Row>
}
export default UserDashboard;