import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { uploadedIssues } from '../../components/issues/UserIssues'
import { Button, Col, Container, Row } from 'react-bootstrap'
import './employeeStats.css'
import { fetchGetCall } from '../../components/utils/fetch/UseFetch'

const EmployeeStats = () => {
  const { state, } = useLocation()
  const navigate = useNavigate()
  console.log('Emp Stats', state)
  const [statsData,setStatsdata] = useState({
    totalIssues: [],
    pending:0,
    resolved:0,
    assigned:[],
    fixed:0
  })

  useEffect(() => {
    getUserIssues()
  }, [])
  const getUserIssues = async () => {
    const result = await uploadedIssues(state)
    if (result.length) {
      const totalIssues = result
      const pending = result.filter(tkt => tkt.issueStatus == 'Pending').length
      const resolved = result.filter(tkt => tkt.issueStatus == 'Resolved').length
      const fixed = result.filter(tkt => tkt.issueStatus == 'Fixed').length
      const assigned = await fetchGetCall('/api/gettodayticket', {id: state._id})
      setStatsdata({totalIssues,pending,resolved,fixed,assigned})
    }
    console.log('result', result)
  }
  return (
    <Container className='card shadow my-2' >
      <Row className='header my-2'>
        <Col md={1}><Button variant='muted' className='fw-bold' onClick={()=> navigate(-1)} > <i className='fas fa-arrow-left'></i></Button> </Col>
        <Col className='d-flex align-items-center gap-2'>
          <div className='img-container'>
            <img src={state.binaryData} className='img br-50' />
          </div>
          <span className='fw-bold fs-3'>{state.fName} {state.lName}</span>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col>
          <span style={{ color: '#888' }} className='my-2'>Profile Image</span>
          <div className='profile-image-container'>
            <img src={state.binaryData} className='img' style={{ borderRadius: '8px' }} />
          </div>
        </Col>
        <Col>
          <Row>
            <span style={{ color: '#888' }} className='my-2'>Role</span>
            <span> {state.designation}</span>
          </Row>
          <hr />
          <Row>
            <span style={{ color: '#888' }} className='my-2'>TEAM</span>
            <span>React Community </span>
          </Row>
        </Col>
        <Col>
          <Row>
            <span style={{ color: '#888' }} className='my-2'>Joined On</span>
            <span>{new Date(state.joinedDate).toLocaleString()}</span>
          </Row>
        </Col>
      </Row>
      <Row className='emp-details '>
        <Col>
        <span style={{ color: '#888' }} className='my-2'>Employeee Details</span>
        <Col><span >First Name : <span>{state.fName}</span></span></Col>
        <Col><span>Last Name : </span><span>{state.lName}</span></Col>
        <Col><span>Email : </span><span>{state.email}</span></Col>
        <Col><span>Phone : </span><span>{state.mobile}</span></Col>
        <Col><span>Position : </span><span>{state.designation}</span></Col>
        </Col>
        <Col>
          <span style={{ color: '#888' }} className='my-2'>Stats</span>
          <Col><span>Total Tickets :</span><span> {statsData.totalIssues.length}</span></Col>
          <Col><span>Resolved: </span><span>{statsData.resolved}</span></Col>
          <Col><span>Pending: </span><span>{statsData.pending}</span></Col>
          <Col><span>Fixed: </span><span>{statsData.fixed}</span></Col>
          <Col><span>Today Ticets: </span><span>{statsData.assigned.length}</span> </Col>
        </Col>
      </Row>

    </Container>
  )
}

export default EmployeeStats