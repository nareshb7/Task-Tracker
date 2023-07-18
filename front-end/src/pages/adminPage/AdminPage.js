import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { UserContext } from '../../App'
import Modal from '../../components/modal/Modal'
import UserIssues, { uploadedIssues } from '../../components/issues/UserIssues'
import Loader from '../../components/utils/loader/Loader'
import { GreenDot, RedDot } from '../../components/utils/Dots/Dots'
import { Button, Col, Row, Table } from 'react-bootstrap'
import { lastSeenTimeFormat } from '../chatBox/MessageBox'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { fetchCall, fetchDeletecall, fetchGetCall } from '../../components/utils/fetch/UseFetch'
import TimeZones, { ParticularTimeZone, particularTimeZone, TimeZone } from '../../components/features/TimeZones'
import { getFullName } from '../../components/utils/GetFullName'
import { debounce } from '../../components/utils/Debounce'
import TaskTable from '../../components/reusable/table/Table'
import AdminPageModals from './AdminPageModals'

const AdminPage = () => {
    const { currentUserVal, setCurrentUserVal } = useContext(UserContext)
    const navigate = useNavigate()
    const { state } = useLocation()
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
    const [showTicketsModal, setShowTicketsModal] = useState(false)
    const [clientsData, setClientsData] = useState([])
    const [showClientsData, setShowClientsData] = useState(false)
    const statusIndicatorStyle = { position: 'absolute', top: '0', right: '0' }

    const getAllUsers = async () => {
        const response = await fetchGetCall('/api/getallusers')
        if (response?.success) {
            setUsers(response.data)
            const val = response.data.filter(user => user?.reqforAdmin == true && user.isAdmin === false)
            setAdminReqData(val)
        }
    }
    const getClients = async () => {
        const { data, success } = await fetchGetCall('/api/getclientslist')
        if (success) {
            setClientsData(data)
        }
    }


    const setAlert = (val, type) => {
        window.alert(`${val}'s account ${type} sucessfully`)
    }
    const removeUser = async (user) => {
        let cnfrm = window.confirm(`Do you want to delete ${user.fName}'s account ??`)
        if (cnfrm) {
            const resp = await fetchDeletecall('/api/deleteuser', { id: user._id })
            if (resp._id) {
                let newData = users.filter(user => user._id != resp._id)
                setUsers(newData)
                setAlert(getFullName(resp), 'Deleted')
            }
        }
    }

    const sortFunc = (value, header) => {
        const type = value.target.value
        const val = header.key
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
    const userLoginPermission = async (user, access) => {
        let status = access
        let cnfrm = window.confirm(`If u click ok ${user.fName}'s account will be ${status ? 'accessible' : "no longer accessible"} `)
        if (cnfrm) {
            const updateUser = await fetchCall('/api/adminupdateuser', { id: user._id, updateValue: status, updateKey: 'isActive', update: 'single' })
            if (updateUser._id) {
                let newData = users.map(user => user._id == updateUser._id ? updateUser : user)
                setUsers(newData)
                setAlert(getFullName(updateUser), 'Updated')
                setOpenUpdateModal(false)
            }
        }
    }
    const requestAcceptFunc = async (id, type, updateField) => {
        const updateKey = updateField || type ? 'isAdmin' : 'reqforAdmin'
        let cnfrm = window.confirm(`Do you want to ${type ? "give" : "remove"} the Admin Access ? `)
        if (cnfrm) {
            const updatedData = await fetchCall('/api/adminupdateuser', { id, updateKey: updateKey, updateValue: type, update: 'single' })
            if (updatedData) {
                let newReqData = adminReqData.filter(user => user._id != updatedData._id)
                setAdminReqData(newReqData)
                setOpenUpdateModal(false)
                alert('Request Updated')
                getAllUsers()
            }
        }
    }
    const uploadedIssuesList = async (developerId) => {
        const result = await uploadedIssues(developerId)
        setIssuesList(result)
        setShowTicketsModal(true)
    }

    const mailChangeAcceptFunc = async (id, type) => {
        const mailUpdateData = mailChangeReqIDs.find(val => val._id == id)
        let cnfrm = window.confirm(`Do you want to ${type ? "accept" : "reject"} the request ? `)
        if (cnfrm) {
            if (type) {
                const { updateKey, updateValue } = mailUpdateData.updateData
                mailUpdateData.reqforMailChange = false
                mailUpdateData[updateKey] = mailUpdateData.updateData.updateValue
                let apiPayload = JSON.parse(JSON.stringify(mailUpdateData))
                delete apiPayload.updateData
                const apiResponse = await fetchCall('api/adminupdateuser', { id, updateValue: apiPayload, update: 'MULTIPLE' })
                if (apiResponse._id) {
                    let newData = mailChangeReqIDs.filter(val => val._id != apiResponse._id)
                    setMailChangeReqIDs(newData)
                }
            }
            else await fetchCall('/api/adminupdateuser', { id, updateKey: 'reqforMailChange', updateValue: type, update: 'single' })

            // Deleting the req in database
            const updateResponse = await fetchCall('/api/mailupdatereq', { user: { id: id, updateKey: 'DELETE' } })
            if (updateResponse._id) {
                let newData = mailChangeReqIDs.filter(val => val._id != updateResponse.id)
                setMailChangeReqIDs(newData)
            }
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
    const handleRoleChange = async (e) => {
        console.log('VAL', e.target.value, updateUserObj)
        const msz = `You are updating ${updateUserObj.fName}'s role from ${updateUserObj.designation} to ${e.target.value}`
        const cnfrm = window.confirm(msz)
        if (cnfrm && e.target.value) {
            const obj = { id: updateUserObj._id, updateKey: 'designation', updateValue: e.target.value, update: 'single' }
            const res = await fetchCall('/api/adminupdateuser', { ...obj })
            console.log('UPDATE', res)
            getAllUsers()
            setOpenUpdateModal(false)
        }
    }

    const showClientStats = (client) => {
        navigate('/clientstats', { state: client })
    }
    const clientTableHeaders = [
        { title: 'Sl. No', key: 'serialNo' },
        { title: 'Consultant Name', key: '', tdFormat: (client) => <span>{client.consultantName} - {client._id}</span> },
        { title: 'Email', key: 'email' },
        { title: 'Phone', key: 'phone' },
        { title: 'Location', key: 'location' },
        { title: 'Technology', key: 'technology' },
        { title: 'Time', key: '', tdFormat: (client) => <ParticularTimeZone timeZone={client.location} /> },
    ]
    const empTableHeaders = [
        { title: 'Sl. No', key: 'serialNo' },
        {
            title: 'Name', node: 'select', values: [{ key: "Up", value: "asc" }, { key: "Down", value: 'desc' }], key: '',
            tdFormat: (user) => <><span>{user.fName} {user.lName}</span><br />
                <span style={{ color: '#888' }} >( {user.userId} )</span></>,
            onClick: sortFunc
        },
        { title: 'Email', key: 'email', node: 'select', values: [{ key: "Up", value: "asc" }, { key: "Down", value: 'desc' }], onClick: sortFunc },
        { title: 'Mobile', key: 'mobile', node: 'select', values: [{ key: "Up", value: "asc" }, { key: "Down", value: 'desc' }], onClick: sortFunc },
        { title: 'Role', key: 'designation', node: 'select', values: [{ key: "Up", value: "asc" }, { key: "Down", value: 'desc' }], onClick: sortFunc },
        {
            title: 'Profile Image', key: '',
            tdFormat: (user) => <div style={{ width: '100px', height: '100px', cursor: 'pointer', position: 'relative' }}>{user.status === 'Online' ? <GreenDot styles={statusIndicatorStyle} /> : <RedDot styles={statusIndicatorStyle} />}
                <img onClick={() => showEmployeeData(user)} src={user.binaryData} alt='image' style={{ width: '100%', height: '100%' }} /></div>
        },
        { title: 'Active User', key: '', node: 'select', onClick: sortFunc, values: [{ key: "Up", value: "asc" }, { key: "Down", value: 'desc' }], onClick: sortFunc, tdFormat: (user) => <span>{user.isActive ? 'Yes' : 'No'}{user.isAdmin && ' (Admin)'} </span> },
        { title: 'Uploaded Issues', key: '', tdFormat: (user) => <Button onClick={() => uploadedIssuesList(user._id)}>Click Here</Button> },
        {
            title: 'Remove User', key: '', tdFormat: (user) => <><Button variant='info' disabled={currentUser.mobile == user.mobile} onClick={() => updateUser(user)}>Update</Button>
                <Button variant='danger' disabled={currentUser.mobile == user.mobile} onClick={() => removeUser(user)}>Remove</Button></>
        },
    ]
    useEffect(() => {
        getAllUsers()
        getClients()
        axios.get('/api/getmailreqIDs')
            .then(data => {
                setMailChangeReqIDs(data.data)
            })
            .catch(err => console.log(err, 'error'))
        if (state?._id && state?.popup == "EMPMODAL") {
            setShowEmpModal(true)
            setShowEmpData(state)
            state.popup = ''
        }
    }, [])
    useEffect(() => {
        setCurrentUser(currentUserVal)
    }, [currentUserVal])
    useEffect(() => {
        setTableData(users)
    }, [users])
    return (
        <>
            <div className='d-flex justify-content-between'>
                <h1>Admin Page : </h1>
                <TimeZones />
            </div>
            <Button onClick={() => setShowClientsData(!showClientsData)}>Show {showClientsData ? 'Users' : 'Clients'}</Button>
            <div style={{ textAlign: 'end' }}>
                <Link className='mx-2' to='/botrequest'><Button > Bot Requests</Button></Link>
                <Link to='/contactData'><Button > ContactUs Messages</Button></Link>
                <Button className='mx-2' onClick={getMailReqIDs}>Mail Request ID's<span style={{ borderRadius: '50%', backgroundColor: '#888', padding: "5px" }}>{mailChangeReqIDs.length}</span>  </Button>
                <Button className='mx-2' onClick={adminRequests}>Admin requests <span style={{ borderRadius: '50%', backgroundColor: '#888', padding: "5px" }}>{adminReqData.length}</span> </Button>
                <input style={{ padding: '10px 20px', marginBlock: '10px' }} type='text' name='searchIpt' value={searchVal} onChange={handleSearch} placeholder='Search here by Dev Name..' />
                <Button style={{ marginInline: '10px' }} >Search</Button>
            </div>
            <AdminPageModals
                openUpdateModal={openUpdateModal}
                setOpenUpdateModal={setOpenUpdateModal}
                updateUserObj={updateUserObj}
                requestAcceptFunc={requestAcceptFunc}
                userLoginPermission={userLoginPermission}
                handleRoleChange={handleRoleChange}
                mailChangeModal={mailChangeModal}
                setMailChangeModal={setMailChangeModal}
                mailChangeReqIDs={mailChangeReqIDs}
                mailChangeAcceptFunc={mailChangeAcceptFunc}
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
                adminReqData={adminReqData}
                showEmpModal={showEmpModal}
                setShowEmpModal={setShowEmpModal}
                showEmpData={showEmpData}
                showTicketsModal={showTicketsModal}
                setShowTicketsModal={setShowTicketsModal}
                issuesList={issuesList}
            />
            {
                showClientsData ? <>
                    <TaskTable
                        pagination
                        headers={clientTableHeaders}
                        tableData={clientsData}
                        handleRowClick={showClientStats}
                    />
                </> : <>
                    {
                        users.length ?
                            <TaskTable
                                pagination
                                headers={empTableHeaders}
                                tableData={tableData}
                            /> : <h3>Data Loading.....</h3>
                    }
                </>
            }
        </>
    )
}

export default AdminPage