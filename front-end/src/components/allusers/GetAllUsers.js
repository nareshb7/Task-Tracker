import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { UserContext } from '../../App'
import Modal from '../modal/Modal'

const GetAllUsers = () => {
    const { currentUserVal } = useContext(UserContext)
    const [users, setUsers] = useState([])
    const [issuesList, setIssuesList] = useState([])
    const [currentUser, setCurrentUser] = useState({})
    const [searchVal, setSearchVal] = useState('')
    const [tableData, setTableData] = useState([])
    const [adminReqData, setAdminReqData] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const tHead = [
        { header: 'Sl. No' },
        { header: 'Name', filter: 'fName' },
        { header: 'Email', filter: 'email' },
        { header: 'Mobile', filter: 'mobile' },
        { header: 'Profile Image' },
        { header: 'Active User', filter: 'isActive' },
        { header: 'Uploaded Isues' },
        { header: 'Remove User' }
    ]
    useEffect(() => {
        axios.get('/api/getallusers')
            .then(data => {
                setUsers(data.data)
                const val = data.data.filter(user => user?.reqforAdmin == true && user.isAdmin === false)
                console.log(val, 'admin requestlist')
                setAdminReqData(val)
            })
            .catch(err => console.log(err, 'err'))
    }, [])
    useEffect(() => {
        setCurrentUser(currentUserVal)
    }, [currentUserVal])
    useEffect(() => {
        setTableData(users)
    }, [users])
    const uploadedIssues = (email) => {
        axios.post('/api/uploadedIssues', { email })
            .then(data => setIssuesList(data.data))
            .catch(err => console.log(err, 'err'))
    }
    const setAlert = (val) => {
        window.alert(`User ${val} Sucessfuly, Refresh the page to see effect.`)
    }
    const removeUser = (user) => {
        let cnfrm = window.confirm(`Do you want to delete ${user.fName}'s account ??`)
        if (cnfrm) {
            axios.post('/api/deleteuser', { id: user._id })
                .then(data => console.log(data, 'delete response'))
                .catch(err => console.log(err, 'err'))
        }
    }
    const updateUser = (user) => {
        console.log(user, 'update')
        let status = user.isActive
        let cnfrm = window.confirm(`If u click ok ${user.fName}'s account will be ${status ? 'no longer accessible' : "accessible"} `)
        if (cnfrm) {
            axios.post('/api/adminupdateuser', { id: user._id, status: !status, "objectType": 'isActive', update:'single' })
                .then(res => setAlert('Updated'))
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
        // let searchData = JSON.parse(JSON.stringify(users))
        const searchData = users.filter(val => val.fName.toLowerCase().includes(e.target.value.toLowerCase()) || val.lName.toLowerCase().includes(e.target.value.toLowerCase()))
        setTableData(searchData)
    }
    const adminRequests = () => {
        setIsModalOpen(true)
    }
    const requestAcceptFunc = (id, type) => {
        console.log(id, type)
        const objectType = type ? 'isAdmin': 'reqforAdmin'
        console.log(objectType, 'objectType')
        let cnfrm = window.confirm(`Do you want to ${type?"accept":"reject"} the request ? `)
        if (cnfrm) {
            axios.post('/api/adminupdateuser', { id, "objectType": objectType, status: type, update: 'single' })
                .then(res => console.log('Admin access updated',res))
                .catch(err => console.log(err, 'Admin access rejected'))
        }
    }
    console.log(issuesList, 'issueslist')
    return (
        <>{
            currentUser && currentUser.isAdmin ? <div>
                <h1>All Users : </h1>
                <div style={{ textAlign: 'end' }}>
                    <button onClick={adminRequests}>Admin requests <span style={{ borderRadius: '50%', backgroundColor: '#888', padding: "5px" }}>{adminReqData.length}</span> </button>
                    <input style={{ padding: '10px 20px', marginBlock: '10px' }} type='text' name='searchIpt' value={searchVal} onChange={handleSearch} placeholder='search here...' />
                    <button style={{ marginInline: '10px' }} >Search</button>
                </div>
                <Modal isOpen={isModalOpen} setModal={setIsModalOpen} header={'Req for Admin Users'} data={adminReqData} requestAcceptFunc={requestAcceptFunc} />
                {
                    users.length ? (<> <table cellPadding='10' style={{ textAlign: 'center' }} border='1'>
                        <thead>
                            <tr>

                                {
                                    tHead.map((th, idx) => {
                                        return (
                                            <th key={idx}>
                                                <span>{th.header}</span>
                                                {
                                                    th.filter && <select onClick={(e) => sortFunc(th.filter, e.target.value)}>
                                                        <option value='none'></option>
                                                        <option value='asc'>Up</option>
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
                                tableData.map((user, idx) => {
                                    return (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td>{user.fName} {user.lName}</td>
                                            <td>{user.email}</td>
                                            <td>{user.mobile}</td>
                                            <td style={{ width: '100px', height: '100px' }}>
                                                <img src={user.binaryData} alt='image' style={{ width: '100%', height: '100%' }} />
                                            </td>
                                            <td> {user.isActive ? 'Yes' : 'No'}{user.isAdmin && ' (Admin)'} </td>
                                            <td>
                                                <button onClick={() => uploadedIssues(user.email)}>Click Here</button>
                                            </td>
                                            <td>
                                                <button disabled={currentUser.mobile == user.mobile || user.isAdmin} onClick={() => removeUser(user)}>Remove</button>
                                                <button disabled={currentUser.mobile == user.mobile || user.isAdmin} onClick={() => updateUser(user)}>Update</button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                        <hr style={{ border: '3px dashed #888' }} />
                        <div style={{ marginBlock: '20px' }}>
                            {
                                issuesList.length > 0 ? (
                                    <div>
                                        <table border='1'>
                                            <thead>
                                                <tr>
                                                    <th>Developer Name</th>
                                                    <th>Client Name</th>
                                                    <th>Technology</th>
                                                    <th>Issue</th>
                                                    <th>Updated Time</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    issuesList.map((issue, idx) => {
                                                        return (
                                                            <tr key={idx}>
                                                                <td>{issue.dName}</td>
                                                                <td>{issue.cName}</td>
                                                                <td>{issue.technology}</td>
                                                                <td>{issue.issue}</td>
                                                                <td>{issue.time}</td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <h3>No Solutions Added</h3>
                                )
                            }
                        </div></>) : <h3>Data Loading.....</h3>
                }
            </div> : <h1>You are not a authorised person to access this page</h1>
        }
        </>
    )
}

export default GetAllUsers