import React, { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { setCookie } from '../utils/CookieComp'
import UserIssues, { uploadedIssues } from '../issues/UserIssues'
import { fetchCall } from '../utils/fetch/UseFetch'

const MyProfile = ({ currentUserVal, setCurrentUserVal, setResponse }) => {
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
  }, [currentUserVal])
  console.log(location.state, 'location out')

  useEffect(() => {
    if (location.state?.status === 'Success') {
      // It will trigger only after verifying the mail with otp
      console.log(location.state, 'location')
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
        location.state ={}
      }
      updateMail()
    }

  }, [location.state])

  const logoutFunc = () => {
    setCurrentUser({})
    setCurrentUserVal({})
    setCookie("63dab3b51d791ebc7821db51", 2)
    setResponse('Please Login')
  }
  const styles = {
    div: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    span: {
      color: '#888'
    }
  }
  const reqAdminAccess = async () => {
    let cnfrm = window.confirm(`Are you eligible for Admin Access ?`)
    if (cnfrm) {
      const apiPayload = { id: currentUser._id, updateKey: 'reqforAdmin', updateValue: true, update: 'single' }
      let resp = await fetchCall('/api/adminupdateuser', apiPayload)
      if (resp._id) {
        setCurrentUserVal(resp)
      } else {
        console.log('AdminAccess Error : ', resp)
      }
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
    if (updateKey === 'email') {
      console.log(emailpattern.test(updateValue), 'email')
      if (emailpattern.test(updateValue) && updateValue !== currentUser.email) {
        length = length + 1
      } else {
        setReqMailError('Email is not valid')
      }
    }
    if (updateKey === 'mobile') {
      console.log(updateValue, 'uopdateVal')
      if (mobilePattern.test(updateValue) && updateValue !== currentUser.mobile) {

        length = length + 1
        setReqMailError('')
      } else {
        setReqMailError('Mobile Number is not valid')
      }
    }
    if (length === 1) {
      console.log('ur mail change req is sent to admin', adminUpdates)
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
  return (
    <div>
      {
        Object.keys(currentUser).length > 2 ?
          <div style={styles.div}>
            <div>
              <h2>Name : {currentUser.fName} {currentUser.lName}  <span style={styles.span}>{currentUser.isAdmin && '( Admin )'}</span></h2>
              <h2>Email : {currentUser.email}</h2>
              <h2>Mobile : {currentUser.mobile}</h2>
              <h2>Password :{currentUser.password.slice(0, 1)}{''.padEnd(currentUser.password.length - 2, '*')}{currentUser.password.slice(-1)}</h2>
            </div>
            <div>
              <img src={currentUser.binaryData} alt='user' style={{ width: '200px', height: '200px' }} />
            </div>
            <div>
              <p style={{ display: `${currentUser.isAdmin ? 'none' : 'block'}` }}>Request  {currentUser.reqforAdmin ? 'sent ' : 'for '}  <button disabled={currentUser.reqforAdmin} onClick={reqAdminAccess}>Admin access</button></p>
              <div>
                <button onClick={logoutFunc} style={{ backgroundColor:'#f44', padding: '10px 20px', border: 'none', margin: '10px', fontSize: '16px' }}>Logout</button>
                <button onClick={() => updateData(currentUser)}>Update Details</button>
              </div>
              <div>
                <button disabled={currentUserVal.reqforMailChange} onClick={() => setMailUpdatereq(!mailUpdatereq)}> Req for Mail update</button>
              </div>
              {
                mailUpdatereq &&
                <div style={{ marginBlock: '10px' }}>
                  <select name='updateKey' defaultValue={adminUpdates.updateKey} onChange={handleChangeMailReq}>
                    <option value='email'>Email</option>
                    <option value='mobile'>Mobile</option>
                  </select>
                  <input placeholder='enter value here' type='text' name='updateValue' value={adminUpdates.updateValue} onChange={handleChangeMailReq} />
                  <div ><button onClick={handleMailReq}>Submit</button></div>
                </div>
              }
              <div style={{ height: '30px' }}>{reqMailError}</div>
              <div><button onClick={showMyIssues}>My Issues</button> </div>

            </div>

          </div> : <h3>Please login to <NavLink to='/login'> click here </NavLink> </h3>
      }
      {
        showIssues && issuesList &&  <div>
          <UserIssues issuesList={issuesList} />
        </div> 
      }
    </div>
  )
}

export default MyProfile