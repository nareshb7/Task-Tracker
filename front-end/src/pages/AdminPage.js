import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { UserContext } from '../App'
import Modal from '../components/modal/Modal'
import UserIssues, { uploadedIssues } from '../components/issues/UserIssues'
import Loader from '../components/utils/loader/Loader'
import { GreenDot, RedDot } from '../components/utils/Dots/Dots'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { lastSeenTimeFormat } from '../chatBox/MessageBox'

const AdminPage = () => {
    const { currentUserVal, setCurrentUserVal } = useContext(UserContext)
    const [openUpdateModal, setOpenUpdateModal] = useState(false)
    const [updateUserObj, setUpdateUserObj] = useState({})
    const [users, setUsers] = useState([])
    const [issuesList, setIssuesList] = useState([])
    const [currentUser, setCurrentUser] = useState({})
    const [searchVal, setSearchVal] = useState('')
    const [tableData, setTableData] = useState([])
    const [adminReqData, setAdminReqData] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [showEmpModal, setShowEmpModal] = useState(false)
    const [showEmpData, setShowEmpData] = useState({})
    const [mailChangeReqIDs, setMailChangeReqIDs] = useState([])
    const [mailChangeModal, setMailChangeModal] = useState(false)
    const tHead = [
        { header: 'Sl. No' },
        { header: 'Name', filter: 'fName' },
        { header: 'Email', filter: 'email' },
        { header: 'Mobile', filter: 'mobile' },
        { header: 'Profile Image' },
        { header: 'Active User', filter: 'isActive' },
        { header: 'Uploaded Issues' },
        { header: 'Remove User' }
    ]
    const statusIndicatorStyle = { position: 'absolute', top: '0', right: '0' }
    const getAllUsers  =async ()=> {
        axios.get('/api/getallusers')
            .then(data => {
                setUsers(data.data)
                const val = data.data.filter(user => user?.reqforAdmin == true && user.isAdmin === false)
                setAdminReqData(val)
            })
            .catch(err => console.log(err, 'err'))
    }
    useEffect(() => {
        getAllUsers()
        axios.get('/api/getmailreqIDs')
            .then(data => {
                setMailChangeReqIDs(data.data)
            })
            .catch(err => console.log(err, 'error'))
    }, [])
    useEffect(() => {
        setCurrentUser(currentUserVal)
    }, [currentUserVal])
    useEffect(() => {
        setTableData(users)
    }, [users])

    const setAlert = (val, type) => {
        window.alert(`${val}'s account ${type} sucessfully`)
    }
    const removeUser = (user) => {
        let cnfrm = window.confirm(`Do you want to delete ${user.fName}'s account ??`)
        if (cnfrm) {
            axios.delete('/api/deleteuser', {
                data: { id: user._id },
                headers: {
                    Authorization: `Bearer`,
                },
            })
                .then(data => {
                    let newData = users.filter(user => user._id != data.data._id)
                    setUsers(newData)
                    setAlert(data.data.fName + " " + data.data.lName, 'Deleted')
                })
                .catch(err => console.log(err, 'err'))
        }
    }

    
    const sortFunc = (val, type) => {
        let sortData = JSON.parse(JSON.stringify(users))
        if (type == 'asc') {
            sortData.sort((a, b) => {
                if (a[val] > b[val]) {
                    return 1
                } if (a[val] < b[val]) {
                    return -1
                }
                return 0
            })
        } else if (type == 'desc') {
            sortData.sort((a, b) => {
                if (a[val] < b[val]) {
                    return 1
                } if (a[val] > b[val]) {
                    return -1
                }
                return 0
            })
        }
        setTableData(sortData)
    }
    const handleSearch = (e) => {
        setSearchVal(e.target.value)
        const searchData = users.filter(val => val.fName.toLowerCase().includes(e.target.value.toLowerCase()) || val.lName.toLowerCase().includes(e.target.value.toLowerCase()))
        setTableData(searchData)
    }
    const adminRequests = () => {
        setIsModalOpen(true)
    }

    // Update Functionality
    const updateUser = (user) => {
        setUpdateUserObj(user)
        setOpenUpdateModal(true)
    }
    const userLoginPermission = (user, access) => {
        let status = access
        let cnfrm = window.confirm(`If u click ok ${user.fName}'s account will be ${status ? 'no longer accessible' : "accessible"} `)
        if (cnfrm) {
            axios.post('/api/adminupdateuser', { id: user._id, updateValue: status, updateKey: 'isActive', update: 'single' })
                .then(res => {
                    let newData = users.map(user => user._id == res.data._id ? res.data : user)
                    setUsers(newData)
                    setAlert(res.data.fName + res.data.lName, 'Updated')
                    setOpenUpdateModal(false)
                })
                .catch(err => console.log(err, 'err'))
        }
    }
    const requestAcceptFunc = (id, type, updateField) => {
        const updateKey =updateField || type ? 'isAdmin' : 'reqforAdmin'
        let cnfrm = window.confirm(`Do you want to ${type ? "give" : "remove"} the Admin Access ? `)
        if (cnfrm) {
            axios.post('/api/adminupdateuser', { id, updateKey: updateKey, updateValue: type, update: 'single' })
                .then(res => {
                    let newReqData = adminReqData.filter(user => user._id != res.data._id)
                    setAdminReqData(newReqData)
                    setOpenUpdateModal(false)
                    alert('Request Updated')
                    getAllUsers()
                })
                .catch(err => console.log(err, 'Admin access rejected'))
        }
    }
    const uploadedIssuesList = async (developerId) => {
        const result = await uploadedIssues(developerId)
        setIssuesList(result)
    }

    const mailChangeAcceptFunc = (id, type) => {
        const mailUpdateData = mailChangeReqIDs.find(val => val._id == id)
        let cnfrm = window.confirm(`Do you want to ${type ? "accept" : "reject"} the request ? `)
        if (cnfrm) {
            if (type) {
                const { updateKey, updateValue } = mailUpdateData.updateData
                mailUpdateData.reqforMailChange = false
                mailUpdateData[updateKey] = mailUpdateData.updateData.updateValue
                let apiPayload = JSON.parse(JSON.stringify(mailUpdateData))
                delete apiPayload.updateData
                axios.post('api/adminupdateuser', { id, updateValue: apiPayload, update: 'MULTIPLE' })
                    .then(res => {
                        let newData = mailChangeReqIDs.filter(val => val._id != res.data._id)
                        setMailChangeReqIDs(newData)
                    })
                    .catch(err => console.log(err, 'User Update Err'))
            }
            else {
                axios.post('/api/adminupdateuser', { id, updateKey: 'reqforMailChange', updateValue: type, update: 'single' })
                    .then(res => console.log(res.data, 'success'))
                    .catch(err => console.log(err, 'Reqfor Mail Change error in user account'))
            }

            // Deleting the req in database
            axios.post('/api/mailupdatereq', { user: { id: id, updateKey: 'DELETE' } })
                .then(res => {
                    let newData = mailChangeReqIDs.filter(val => val._id != res.data.id)
                    setMailChangeReqIDs(newData)
                })
                .catch(err => console.log(err, 'else Mail Update Err'))
        }
    }
    const showEmployeeData = async (empDetails) => {
        const result = await uploadedIssues(empDetails._id)
        empDetails['uploadedIssues'] = result
        empDetails['technologies'] = [...new Set(result.map(val => val.technology))]
        setShowEmpData(empDetails)
        setShowEmpModal(true)
        console.log('Employee::', empDetails)
    }
    const getMailReqIDs = () => {
        if (!mailChangeReqIDs[0]?.fName) {
            let final = users.filter(valu => valu.reqforMailChange).map(val => {
                let obj = mailChangeReqIDs.find(ids => ids.id == val._id)
                val['updateData'] = obj
                return val
            })
            setMailChangeReqIDs(final)
        }
        setMailChangeModal(true)
    }
    return (
        <>{
            currentUser && currentUser.isAdmin ? <div>
                <h1>All Users : </h1>
                <div style={{ textAlign: 'end' }}>
                    <Button className='mx-2' onClick={getMailReqIDs}>Mail Request ID's<span style={{ borderRadius: '50%', backgroundColor: '#888', padding: "5px" }}>{mailChangeReqIDs.length}</span>  </Button>
                    <Button className='mx-2' onClick={adminRequests}>Admin requests <span style={{ borderRadius: '50%', backgroundColor: '#888', padding: "5px" }}>{adminReqData.length}</span> </Button>
                    <input style={{ padding: '10px 20px', marginBlock: '10px' }} type='text' name='searchIpt' value={searchVal} onChange={handleSearch} placeholder='Search here by Dev Name..' />
                    <Button style={{ marginInline: '10px' }} >Search</Button>
                </div>
                <Modal isOpen={openUpdateModal} setModal={setOpenUpdateModal}>
                    <>
                        <h3>Update the user</h3>
                        <Row className='d-flex flex-column'>
                            <Col>
                                <span className='fw-bold fs-3'>Admin Access : </span>
                                 <Button onClick={()=> requestAcceptFunc(updateUserObj._id,true )} > Allow </Button> 
                                 <Button variant='warning' onClick={()=> requestAcceptFunc(updateUserObj._id,false, 'isAdmin' )} >Deny</Button>
                            </Col>
                            <Col>
                                <span className='fw-bold fs-3'>Login Access : </span>
                                  <Button onClick={()=> userLoginPermission(updateUserObj, true) } > Allow </Button> 
                                  <Button variant='warning' onClick={()=> userLoginPermission(updateUserObj, false) }>Deny</Button>
                            </Col>
                        </Row>
                    </>
                </Modal>
                <Modal isOpen={mailChangeModal} setModal={setMailChangeModal}>
                    <>
                        <h2>Profile Update Requests</h2>
                        {
                            mailChangeReqIDs.length ? <>
                                {
                                    mailChangeReqIDs.map((user, idx) => {
                                        return (
                                            <li key={idx} className='li-style'>
                                                <div>
                                                    {
                                                        user.fName && <h3>{user.fName + " " + user.lName} - {user.email} </h3>
                                                    }
                                                    {
                                                        user.updateData && <h3><span>Update Data: </span> <span>{user.updateData.updateKey}</span> - <span>{user.updateData.updateValue}</span></h3>
                                                    }
                                                </div>

                                                <div>
                                                    <Button onClick={() => mailChangeAcceptFunc(user._id, true)}>Approve</Button>
                                                    <Button onClick={() => mailChangeAcceptFunc(user._id, false)}>Deny</Button>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </> : <h4>No Requests</h4>
                        }
                    </>

                </Modal>
                <Modal isOpen={isModalOpen} setModal={setIsModalOpen} >
                    <>
                        <h2>Admin Access Requests</h2>
                        {
                            adminReqData.length ? <>
                                {
                                    adminReqData.map((user, idx) => {
                                        return (
                                            <li key={idx} className='li-style'>
                                                <div>
                                                    {
                                                        user.fName && <h3>{user.fName + " " + user.lName} - {user.email} </h3>
                                                    }
                                                    {
                                                        user.updateData && <h3><span>Update Data: </span> <span>{user.updateData.updateKey}</span> - <span>{user.updateData.updateValue}</span></h3>
                                                    }
                                                </div>

                                                <div>
                                                    <button onClick={() => requestAcceptFunc(user._id, true)}>Approve</button>
                                                    <button onClick={() => requestAcceptFunc(user._id, false)}>Deny</button>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </> : <h4>No Requests</h4>
                        }
                    </>
                </Modal>
                <Modal isOpen={showEmpModal} setModal={setShowEmpModal}>
                    <div style={{ display: 'flex' }}>
                        <div>
                            <h3>Name : {showEmpData.fName + " " + showEmpData.lName}</h3>
                            <h3>Email: {showEmpData.email}</h3>
                            <h3>Mobile : {showEmpData.mobile}</h3>
                            {
                                showEmpData.status === 'Online' ? <h3>Status : Online</h3> :
                                    <h3>Last Active On : {lastSeenTimeFormat(showEmpData.lastActiveOn)}</h3>
                            }
                            <h3>Active User : {showEmpData.isActive ? "Yes" : 'No'}</h3>
                            <h3>Admin : {showEmpData.isAdmin ? "Yes" : "No"}</h3>
                            <h3>Joined Date : {showEmpData.joinedDate ? new Date(showEmpData.joinedDate).toLocaleString() : 'No Data Found'}</h3>
                            <h3>Uploaded Issues :{showEmpData.uploadedIssues?.length ? `${showEmpData.uploadedIssues.length}` : 'counting....'}</h3>
                            <h3>Technologies : {showEmpData.technologies?.length ? `${showEmpData.technologies}` : "Loading...."}</h3>
                        </div>
                        <div style={{ width: '100px', height: '100px' }}>
                            <img src={showEmpData.binaryData} style={{ width: '100%', height: '100%' }} />
                        </div>
                    </div>
                </Modal>
                {
                    users.length ? (<> <Table striped hover responsive>
                        <caption>All Users</caption>
                        <thead style={{ color: '#000' }}>
                            <tr>
                                {
                                    tHead.map((th, idx) => {
                                        return (
                                            <th key={idx}>
                                                <span>{th.header}</span>
                                                {
                                                    th.filter && <select onClick={(e) => sortFunc(th.filter, e.target.value)}>
                                                        <option value='asc'> Up</option>
                                                        <option value='desc'>Down</option>
                                                    </select>
                                                }
                                            </th>
                                        )
                                    })
                                }
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tableData.length ? <>
                                    {
                                        tableData.map((user, idx) => {
                                            return (
                                                <tr key={idx}>
                                                    <td>{idx + 1}</td>
                                                    <td>{user.fName} {user.lName}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.mobile}</td>
                                                    <td style={{ width: '100px', height: '100px', cursor: 'pointer', position: 'relative' }}>
                                                        {user.status === 'Online' ? <GreenDot styles={statusIndicatorStyle} /> : <RedDot styles={statusIndicatorStyle} />}
                                                        <img onClick={() => showEmployeeData(user)} src={user.binaryData} alt='image' style={{ width: '100%', height: '100%' }} />
                                                    </td>
                                                    <td> {user.isActive ? 'Yes' : 'No'}{user.isAdmin && ' (Admin)'} </td>
                                                    <td>
                                                        <Button onClick={() => uploadedIssuesList(user._id)}>Click Here</Button>
                                                    </td>
                                                    <td>
                                                        <Button variant='info' disabled={currentUser.mobile == user.mobile} onClick={() => updateUser(user)}>Update</Button>
                                                        <Button variant='danger' disabled={currentUser.mobile == user.mobile} onClick={() => removeUser(user)}>Remove</Button>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </> : <tr>
                                    <td colSpan={8}>No result found <Loader /> </td>
                                </tr>
                            }
                        </tbody>
                    </Table>
                        <hr style={{ border: '3px dashed #888' }} />
                        <div style={{ marginBlock: '20px' }}>
                            {
                                issuesList.length > 0 ? (
                                    <UserIssues issuesList={issuesList} />
                                ) : (
                                    <h3>No Solutions Added</h3>
                                )
                            }
                        </div></>) : <h3>Data Loading.....</h3>
                }
            </div> : <div style={{ textAlign: 'center' }}>
                <div>
                    <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQc8odhMTP7bNGEGX4tiBh8NXaDu6CcycWlg&usqp=CAU' alt='img' />
                </div>
                <h1>Sorry, You are not an authorised person to access this page :)</h1></div>
        }
        </>
    )
}

export default AdminPage