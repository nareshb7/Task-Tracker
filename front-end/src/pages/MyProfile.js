import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import UserIssues, { uploadedIssues } from '../components/issues/UserIssues'
import { fetchCall } from '../components/utils/fetch/UseFetch'
import { logoutFunc } from '../components/utils/LogoutFunc'
import { setCookie } from '../components/utils/CookieComp'
import { Button, Card, Col, Row } from 'react-bootstrap'
import mockNewsData from '../components/utils/mockdata/newsMockData.json'
import { addActivity } from './activityPage/ActivityPage'
import { UserContext } from '../App'

const MyProfile = () => {
  const { currentUserVal, setCurrentUserVal, socket, setIsLoggedIn } = useContext(UserContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [currentUser, setCurrentUser] = useState({})
  const [mailUpdatereq, setMailUpdatereq] = useState(false)
  const [reqMailError, setReqMailError] = useState('')
  const [showIssues, setShowIssues] = useState(false)
  const [issuesList, setIssuesList] = useState([])
  const [adminUpdates, setAdminUpdates] = useState({
    updateKey: 'email',
    updateValue: ''
  })

  useEffect(() => {
    setCurrentUser(currentUserVal)
    addActivity(currentUserVal, 'Profile page', `Visited profile page`)
  }, [currentUserVal])

  useEffect(() => {
    if (location.state?.status === 'Success') {
      // It will trigger only after verifying the mail with otp
      async function updateMail() {
        currentUserVal['reqforMailChange'] = true
        const user = { id: currentUserVal._id, ...location.state.data }
        setReqMailError('Request sending...')
        const mResp = await fetchCall('api/mailUpdatereq', { user })
        setReqMailError(mResp)
        const aResp = await fetchCall('api/adminupdateuser', { id: currentUserVal._id, updateValue: currentUserVal, update: 'MULTIPLE' })
        if (aResp._id) {
          setCurrentUserVal(aResp)
        } else {
          console.log('aResp Error :', aResp)
        }
        location.state = {}
      }
      updateMail()
    }

  }, [location.state])

  const logout = async (id) => {
    setCurrentUser({})
    setIsLoggedIn(false)
    setCurrentUserVal({})
    sessionStorage.removeItem('userID')
    addActivity(currentUserVal, 'Logout page', `Logged Out`)
    await logoutFunc(currentUserVal)
    setCookie("63dab3b51d791ebc7821db51", 2)
    socket.emit('new-user')
  }
  const styles = {
    div: {
      display: 'flex',
      justifyContent: 'space-evenly',
      alignItems: 'center'
    },
    span: {
      color: '#888'
    }
  }
  const updateData = (data) => {
    navigate('/updateuser', { state: data })
  }
  const handleChangeMailReq = (e) => {
    const { name, value } = e.target
    setAdminUpdates({ ...adminUpdates, [name]: value })
  }

  const handleMailReq = () => {
    const emailpattern = /^[a-z][a-z0-9]+@[a-z]+(?:[.][a-z]{2,})+$/
    const mobilePattern = /^[0-9]{10}$/
    const { updateKey, updateValue } = adminUpdates
    let length = 0
    if (updateKey == 'email') {
      if (emailpattern.test(updateValue) && updateValue != currentUser.email) {
        length = length + 1
      } else {
        setReqMailError('Email is not valid')
      }
    }
    if (updateKey == 'mobile') {
      if (mobilePattern.test(updateValue) && updateValue != currentUser.mobile) {
        length = length + 1
        setReqMailError('')
      } else {
        setReqMailError('Mobile Number is not valid')
      }
    }
    if (length === 1) {
      setReqMailError('Requset sending...')
      setAdminUpdates({ updateKey: 'email', updateValue: '' })
      navigate('/verifymail/login', { state: adminUpdates })
      alert('If data is not valid Ur req will be rejected')
    }
  }
  const showMyIssues = async () => {
    setShowIssues(!showIssues)
    let result = await uploadedIssues(currentUserVal._id)
    setIssuesList(result)

  }
  return (<>
    <Row md={12}>
      <Col md={5} className='card m-3'>
        <h2>Name : {currentUser.fName} {currentUser.lName}  <span style={styles.span}>{currentUser.isAdmin && '( Admin )'}</span></h2>
        <h2>Email : {currentUser.email}</h2>
        <h2>Mobile : {currentUser.mobile}</h2>
        <h2>User ID : {currentUser.userId}</h2>
        {/* <h2>Password :{currentUser.password.slice(0, 2)}{''.padEnd(currentUser.password.length - 4, '*')}{currentUser.password.slice(-2)}</h2> */}
      </Col>
      <Col md={2} className='m-3'>
        <img src={currentUser.binaryData} alt='image' style={{ width: '200px', height: '200px' }} />
      </Col>
      <Col md={4} className='card m-3'>
        {/* <p style={{ display: `${currentUser.isAdmin ? 'none' : 'block'}` }}>Request  {currentUser.reqforAdmin ? 'sent ' : 'for '}  <Button disabled={currentUser.reqforAdmin} onClick={reqAdminAccess}>Admin access</Button></p> */}
        <div>
          <Button onClick={() => logout(currentUser._id)} style={{ backgroundColor: '#f44', padding: '10px 20px', border: 'none', margin: '10px', fontSize: '16px' }}>Logout</Button>
          <Button onClick={() => updateData(currentUser)}>Update Details</Button>
        </div>
        <div>
          <Button disabled={currentUserVal.reqforMailChange} onClick={() => setMailUpdatereq(!mailUpdatereq)}> Req for Mail update</Button>
        </div>
        {
          mailUpdatereq &&
          <div style={{ marginBlock: '10px' }}>
            <select name='updateKey' defaultValue={adminUpdates.updateKey} onChange={handleChangeMailReq}>
              <option value='email'>Email</option>
              {/* <option value='mobile'>Mobile</option> */}
            </select>
            <input placeholder='enter value here' type='text' name='updateValue' value={adminUpdates.updateValue} onChange={handleChangeMailReq} />
            <div ><Button onClick={handleMailReq}>Submit</Button></div>
          </div>
        }
        <div style={{ height: '30px' }}>{reqMailError}</div>
        <div>
          <Button onClick={showMyIssues}>My Tickets</Button>
          <Button className='mx-2' onClick={() => {
            setTimeout(() => {
              navigate('/empstats', { state: currentUserVal })
            }, 0)
          }}
          > Go to Stats page</Button>
        </div>
      </Col>
    </Row>
    <Row>
      {
        showIssues && issuesList && <div>
          <UserIssues issuesList={issuesList} />
        </div>
      }
    </Row>
    <Row className='my-2 d-flex flex-column' >
      <Col className='fw-bold fs-4 text-start'>Entertainment Zone:</Col>
      <Col >
        <marquee style={{ backgroundColor: '#ff0' }}>
          <a href='https://guessthenumbergame1.netlify.app/' className='mx-2' target='_blank'>
            <Button>Guess the number game </Button>
          </a>
          <Link to='/game/1' className='mx-2'><Button> RPS Game </Button></Link>
          <Link to='/game/2' className='mx-2'><Button>Multiplications </Button></Link>
        </marquee>
      </Col>
    </Row>
    <Row className='my-2 d-flex flex-column'>
      <Col className='fw-bold fs-4 text-start'>Latest News:</Col>
      <Row className=' flex-row gap-3 m-auto' style={{ overflowY: 'scroll', height: '400px' }}>
        {
          mockNewsData.map((article) => (
            <Card as={'a'} href={article.link} target='_blank' style={{ width: '300px' }} key={article._id}>
              <Card.Img className='rounded my-1' src={article.media} style={{ width: '250px', height: '250px' }} alt={article.rights} />
              <Card.Title>{article.title}</Card.Title>
              <Card.Text>{article.excerpt}</Card.Text>
            </Card>
          ))
        }
      </Row>
    </Row>
  </>
  )
}

export default MyProfile
// c46bb0cfad8d4deb8da8650ea2d2fb5d