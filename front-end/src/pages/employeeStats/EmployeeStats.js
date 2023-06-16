import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { uploadedIssues } from '../../components/issues/UserIssues'
import { Button, Col, Container, Row } from 'react-bootstrap'
import './employeeStats.css'
import { fetchGetCall } from '../../components/utils/fetch/UseFetch'
import ActivityPage, { addActivity } from '../activityPage/ActivityPage'
import { getFullName } from '../../components/utils/GetFullName'
import { UserContext } from '../../App'

const EmployeeStats = () => {
  const { state, } = useLocation()
  const {currentUserVal} = useContext(UserContext)
  const navigate = useNavigate()
  const [statsData, setStatsdata] = useState({
    totalIssues: [],
    pending: 0,
    resolved: 0,
    assigned: [],
    fixed: 0,
    helpTaken:0
  })
  const [helpedTickets,setHelpedTickets] = useState([])
  const [experience, setExperience] = useState('')
  const getHelpedSolutions = async ()=> {
    const {data, success} = await fetchGetCall('/api/getData')
    if (success) {
      const helpd = data.filter(val => val?.helpedDev?.id == state._id)
      setHelpedTickets(helpd)
    }
  }
  
  const getUserIssues = async () => {
    const result = await uploadedIssues(state)
    if (result.length) {
      const totalIssues = result
      const pending = result.filter(tkt => tkt.issueStatus == 'Pending').length
      const resolved = result.filter(tkt => tkt.issueStatus == 'Resolved').length
      const fixed = result.filter(tkt => tkt.issueStatus == 'Fixed').length
      const {data} = await fetchGetCall('/api/gettodayticket', { id: state._id })
      const helpTaken = totalIssues.filter(val => val.helpedDev).length
      setStatsdata({ totalIssues, pending, resolved, fixed,assigned: data , helpTaken})
    }
  }
  const getDays = (dt)=> {
    const oneDay = 24 * 60* 60 * 1000
    const today = new Date().getTime()
    const joinedDay = new Date(dt).getTime()
    const totalDays = (today - joinedDay) / oneDay
    const years = Math.floor(totalDays/ 365.24)
    const remainDays = Math.floor(totalDays - (years * 365.24))
    const month = Math.floor(remainDays / 30.43)
    const days = Math.floor(remainDays % 30.43)
    const result = `${years} years ${month} months ${days} days`
    setExperience(result)
  }
  useEffect(() => {
    getUserIssues()
    getHelpedSolutions()
    getDays(state.joinedDate)
    addActivity(currentUserVal, 'Stats page', `Visited Stats Page of ${getFullName(state)}`)
  }, [])
  return (
    <Container className='card shadow my-2' >
      <Row className='header my-2'>
        <Col md={1}><Button variant='muted' className='fw-bold' onClick={() => navigate(-1)} > <i className='fas fa-arrow-left'></i></Button> </Col>
        <Col className='d-flex align-items-center gap-2'>
          <div className='img-container'>
            <img src={state.binaryData} className='img br-50' />
          </div>
          <span className='fw-bold fs-3'>{state.fName} {state.lName}</span>
          <span> ( {state?.userId ? state.userId : ''} )</span>
        </Col>
      </Row>
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
          <Row>
            <span style={{ color: '#888' }} className='my-2'>TEAM</span>
            <span>React Community </span>
          </Row>
        </Col>
        <Col>
          <Row>
            <span style={{ color: '#888' }} className='my-2'>Joined On</span>
            <span>{new Date(state.joinedDate).toLocaleString()}</span>
            <span style={{ color: '#888' }} className='my-2'>Working from</span>
            <span>{experience}</span>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col>
          <Row className='d-flex flex-column'>
            <span style={{ color: '#888' }} className='my-2'>Employeee Details</span>
            <Col><span >First Name : <span>{state.fName}</span></span></Col>
            <Col><span>Last Name : </span><span>{state.lName}</span></Col>
            <Col><span>Email : </span><span>{state.email}</span></Col>
            <Col><span>Phone : </span><span>{state.mobile}</span></Col>
            <Col><span>Role : </span><span>{state.designation}</span></Col>
          </Row>
        </Col>
        <Col>
          <Row className='d-flex flex-column'>
            <span style={{ color: '#888' }} className='my-2'>Stats</span>
            <Col><span>Total Tickets :</span><span> {statsData.totalIssues.length}</span></Col>
            <Col><span>Resolved: </span><span>{statsData.resolved}</span></Col>
            <Col><span>Pending: </span><span>{statsData.pending}</span></Col>
            <Col><span>Fixed: </span><span>{statsData.fixed}</span></Col>
            <Col><span>Today Ticets: </span><span>{statsData.assigned.length}</span> </Col>
            <Col><span>Solved with another Dev: </span><span>{statsData.helpTaken}</span></Col>
            <Col><span>Helped Tickets: </span><span>{helpedTickets.length} </span></Col>
          </Row>
        </Col>
      </Row>
      <ActivityPage id={state._id} name={getFullName(state)}/>
    </Container>
  )
}

export default EmployeeStats


/* 
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
*/