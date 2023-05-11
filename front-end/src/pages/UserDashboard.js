import React, { useEffect, useState } from 'react'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { uploadedIssues } from '../components/issues/UserIssues'
import { useNavigate } from 'react-router-dom'

const UserDashboard = ({ currentUserVal }) => {
    const navigate = useNavigate()
    const [dashboardData, setDashboardData] = useState({
        totalIssues: [],
        resolved: 0,
        pending: 0,
        fixed: 0,
    })
    useEffect(() => {
        const getIssues = async () => {
            const totalIssues = await uploadedIssues(currentUserVal._id)
            const resolved = totalIssues.filter(issue => issue.issueStatus == 'Resolved').length
            const pending = totalIssues.filter(issue => issue.issueStatus == 'Pending').length
            const fixed = totalIssues.filter(issue => issue.issueStatus == 'Fixed').length
            setDashboardData({ totalIssues, resolved, pending, fixed })
        }
        getIssues()
    }, [])
    const updateIssue = (tkt)=> {
        console.log('Update::', tkt)
        // {
        //     dName: isLoggedin.fName + " " + isLoggedin.lName,
        //     cName: '',
        //     technology: '',
        //     issue: '',
        //     time: '',
        //     binaryData: '',
        //     issueTitle: '',
        //     solutions: [],
        //     solution: '',
        //     companyName: '',
        //     appType: '',
        //     developerId: '',
        //     images: "",
        //     issueImages: [{ image: '' }],
        //     issueStatus: '',
        // }
        const obj = {
            cName: tkt.name,
            technology: tkt.technology,
            
        }
        navigate('/addIssue', {state : {technology: tkt.technology, cName: tkt.consultantName, id: tkt._id}} )
    }
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
                    <Col><span className='fs-5 fw-bold'>Today Tickets : </span><span className='fs-3 fw-bold'>{currentUserVal.todayTickets.length}</span></Col>
                </Row>
                <Row>
                <Table>
                    <thead>
                        <tr>
                            <th>Client </th>
                            <th>Phone</th>
                            <th>Technology</th>
                            <th>AssignedBy</th>
                            <th>Assigned Time</th>
                            <th>Update</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            currentUserVal.todayTickets.map((tkt, idx) => {
                                return <tr key={idx + Math.random()}>
                                    <td>{tkt.consultantName}</td>
                                    <td>{tkt.phone}</td>
                                    <td>{tkt.technology}</td>
                                    <td>{tkt.assignedBy}</td>
                                    <td> {new Date(tkt.assignedDate).toLocaleString()}</td>
                                    <td><Button onClick={()=> updateIssue(tkt)}>Update</Button></td>
                                </tr>
                            })
                        }
                    </tbody>
                </Table>
                </Row>
                {/* {currentUserVal.todayTickets.map((tkt, idx) => {
                    return <Col md={12} className='card' key={idx +Math.random()}>
                        <span>Client : {tkt.name}</span>
                        <span> Phone: {tkt.phn}</span>
                        <span>Technology: {tkt.technology}</span>
                        <span>Assigned By : {tkt.assignedBy}</span>
                    </Col> */}

            </Row>
        </Col>
    </Row>
}
export default UserDashboard;