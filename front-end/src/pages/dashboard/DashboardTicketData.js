import React from 'react'
import { Button, Col, Row } from 'react-bootstrap'

const DashboardTicketData = ({employeesdata, ticketsData, todayTickets, addNewTickets}) => {
  return (
    <>  <Row>
    <Col><Button onClick={() => addNewTickets('TICKET')}>Add New Ticket</Button></Col>
    <Col><Button onClick={() => addNewTickets('CLIENT')}>Add New Client</Button></Col>
</Row>
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
                <Row className='d-flex my-2 gap-3 fw-300'>
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
                <Row className='d-flex my-2 gap-3 fw-bold'>
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
    </>
  )
}

export default DashboardTicketData