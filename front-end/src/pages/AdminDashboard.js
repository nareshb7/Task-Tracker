import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'


const AdminDashboard =({currentUserVal, socket})=> {
    const [employeesdata,setEmployeesdata] = useState({
        employees:[],
        total:0,
        active:0,
        offline:0,
        percentage:0
    })
    const [taskData, setTaskData] = useState({
        total:15,
        assigned:12,
        resolved:10,
        pending:5,
        percentage:65
    })
    socket.off('new-user').on('new-user', (employees) => {
        const total = employees.length
        const active = employees.filter(user => user.status == "Online").length
        const offline = employees.filter(user => user.status == "Offline").length
        const percentage = (active/ total * 100).toFixed(2)
        setEmployeesdata({total, active, offline, employees, percentage})
    })
    useEffect(()=> {
        socket.emit('new-user')
    },[])
    return <Row>
        <Col>
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
                    <span className='fs-3 px-1'>Total Tasks :</span>
                    <span className='fs-1 text-start'>{taskData.total}</span>
                </Col>
                <Col className='card bg-success'>
                    <span className='fs-3 px-1'>Resolved Tasks :</span>
                    <span className='fs-1 text-start'>{taskData.resolved}</span>
                </Col>
                <Col className='card bg-info'>
                    <span className='fs-3 px-1'>Pending Tasks :</span>
                    <span className='fs-1 text-start'>{taskData.pending}</span>
                </Col>
                <Col className='card bg-warning'>
                    <span className='fs-3 px-1'>Percentage: </span>
                    <span className='fs-1 text-start'>{taskData.percentage}%</span>
                </Col>
            </Row>
        </Col>
    </Row>
}
export default AdminDashboard