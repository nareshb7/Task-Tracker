import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { UserContext } from '../../App'
import Modal from '../modal/Modal'
import UserIssues, { uploadedIssues } from '../issues/UserIssues'
import Loader from '../utils/loader/Loader'

const AdminPage = () => {
    const { currentUserVal, setCurrentUserVal } = useContext(UserContext)
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
    useEffect(() => {
        axios.get('/api/getallusers')
            .then(data => {
                setUsers(data.data)
                const val = data.data.filter(user => user?.reqforAdmin == true && user.isAdmin === false)
                console.log(val, 'admin requestlist')
                setAdminReqData(val)
            })
            .catch(err => console.log(err, 'err'))
        axios.get('/api/getmailreqIDs')
        .then(data => setMailChangeReqIDs(data.data))
        .catch(err => console.log(err, 'error'))
    }, [])
    useEffect(() => {
        setCurrentUser(currentUserVal)
    }, [currentUserVal])
    useEffect(() => {
        setTableData(users)
    }, [users])
    
    const setAlert= (val, type)=> {
        window.alert(`${val}'s account ${type} sucessfully`)
    }
    const removeUser = (user) => {
        let cnfrm = window.confirm(`Do you want to delete ${user.fName}'s account ??`)
        if (cnfrm) {
            axios.post('/api/deleteuser', { id: user._id })
                .then(data => {
                    console.log(data, 'data deleted')
                    let newData = users.filter(user => user._id != data.data._id)
                    setUsers(newData)
                    setAlert(data.fName+data.lName , 'Deleted')
                })
                .catch(err => console.log(err, 'err'))
        }
    }
   
    const updateUser = (user) => {
        console.log(user, 'update')
        let status = user.isActive
        let cnfrm = window.confirm(`If u click ok ${user.fName}'s account will be ${status ? 'no longer accessible' : "accessible"} `)
        if (cnfrm) {
            axios.post('/api/adminupdateuser', { id: user._id, updateValue: !status, updateKey: 'isActive', update:'single' })
                .then(res => {
                    let newData = users.map(user => user._id == res.data._id ? res.data : user)
                    setUsers(newData)
                    setAlert(res.data.fName+res.data.lName , 'Updated')
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
        // let searchData = JSON.parse(JSON.stringify(users))
        const searchData = users.filter(val => val.fName.toLowerCase().includes(e.target.value.toLowerCase()) || val.lName.toLowerCase().includes(e.target.value.toLowerCase()))
        setTableData(searchData)
    }
    const adminRequests = () => {
        setIsModalOpen(true)
    }
    const requestAcceptFunc = (id, type) => {
        console.log(id, type)
        const updateKey = type ? 'isAdmin': 'reqforAdmin'
        let cnfrm = window.confirm(`Do you want to ${type?"accept":"reject"} the request ? `)
        if (cnfrm) {
            axios.post('/api/adminupdateuser', { id, updateKey: updateKey, updateValue: type, update: 'single' })
                .then(res => {
                    let newReqData = adminReqData.filter(user=> user._id != res.data._id)
                    setAdminReqData(newReqData)
                })
                .catch(err => console.log(err, 'Admin access rejected'))
        }
    }
    const uploadedIssuesList = async (developerId)=> {
        const result =await uploadedIssues(developerId)
        setIssuesList(result)
    }

    const mailChangeAcceptFunc =(id, type)=> {
        console.log(id, type, 'mailchangeaCCEPT FUNC')
        const mailUpdateData = mailChangeReqIDs.find(val => val._id == id)
        let cnfrm = window.confirm(`Do you want to ${type?"accept":"reject"} the request ? `)
        if (cnfrm) {
            if (type){
                
                axios.post('/api/mailupdatereq', {user:{ id:id, updateKey:'DELETE'}})
                .then(res => {
                    console.log(res, 'res')
                    let newData = mailChangeReqIDs.filter(val => val._id != res.data.id)
                    setMailChangeReqIDs(newData)
                })
                .catch(err => console.log(err, 'errr'))
                const {updateKey, updateValue} = mailUpdateData.updateData
                
                mailUpdateData.reqforMailChange = false
                mailUpdateData[updateKey] = mailUpdateData.updateData.updateValue
                delete mailUpdateData.updateData
                axios.post('api/adminupdateuser', {id  ,updateValue: mailUpdateData, update: 'MULTIPLE'})
                .then(res => {
                    let newData = mailChangeReqIDs.filter(val => val._id != res.data._id)
                    console.log(res, 'res', newData)
                    setMailChangeReqIDs(newData)
                })
                .catch(err => console.log(err, 'errrr user updating'))
            } 
            else {
                axios.post('/api/mailupdatereq', {user:{ id:id, updateKey:'DELETE'}})
                .then(res => {
                    console.log(res, 'res')
                    let newData = mailChangeReqIDs.filter(val => val._id != res.data.id)
                    setMailChangeReqIDs(newData)
                })
                .catch(err => console.log(err, 'errr'))

                axios.post('/api/adminupdateuser', { id, updateKey: 'reqforMailChange', updateValue: type, update: 'single' })
                .then(res => console.log(res.data, 'success'))
                .catch(err => console.log(err, 'Reqfor Mail Change error in user account'))
            }
        }
    }
    const showEmployeeData = async (empDetails)=> {
        const result =await  uploadedIssues(empDetails._id)
        empDetails['uploadedIssues'] = result
        empDetails['technologies'] = [...new Set(result.map(val => val.technology))]
        setShowEmpData(empDetails)
        setShowEmpModal(true)
        console.log(empDetails, 'emp')
    }
    const getMailReqIDs = ()=> {
        if (!mailChangeReqIDs[0]?.fName) {
            let final = users.filter(val => val.reqforMailChange).map(val => {
                let obj = mailChangeReqIDs.find(ids => ids.id == val._id)
                console.log(obj, 'obj')
                val['updateData'] = obj
                return val
            })
            
            console.log(mailChangeReqIDs, 'mail', final) 
            setMailChangeReqIDs(final) 
        }
        setMailChangeModal(true)
    }
    return (
        <>{
            currentUser && currentUser.isAdmin ? <div>
                <h1>All Users : </h1>
                <div style={{ textAlign: 'end' }}>
                    <button onClick={getMailReqIDs}>Mail Request ID's<span style={{ borderRadius: '50%', backgroundColor: '#888', padding: "5px" }}>{mailChangeReqIDs.length}</span>  </button>
                    <button onClick={adminRequests}>Admin requests <span style={{ borderRadius: '50%', backgroundColor: '#888', padding: "5px" }}>{adminReqData.length}</span> </button>
                    <input style={{ padding: '10px 20px', marginBlock: '10px' }} type='text' name='searchIpt' value={searchVal} onChange={handleSearch} placeholder='Search here by Dev Name..' />
                    <button style={{ marginInline: '10px' }} >Search</button>
                </div>
                <Modal isOpen={mailChangeModal} setModal={setMailChangeModal} header={'Profile Update Requests'} data={mailChangeReqIDs} requestAcceptFunc={mailChangeAcceptFunc} />
                <Modal isOpen={isModalOpen} setModal={setIsModalOpen} header={'Req for Admin Users'} data={adminReqData} requestAcceptFunc={requestAcceptFunc} />
                <Modal isOpen={showEmpModal} setModal={setShowEmpModal} header={'User Data'} employee={showEmpData}  />
                {
                    users.length ? (<> <table cellPadding='10' style={{ textAlign: 'center' }} border='1'>
                        <caption>All Users</caption>
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
                                tableData.length ? <>
                                {
                                tableData.map((user, idx) => {
                                    return (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td>{user.fName} {user.lName}</td>
                                            <td>{user.email}</td>
                                            <td>{user.mobile}</td>
                                            <td style={{ width: '100px', height: '100px' }}>
                                                <img onClick={()=> showEmployeeData(user)} src={user.binaryData} alt='image' style={{ width: '100%', height: '100%' }} />
                                            </td>
                                            <td> {user.isActive ? 'Yes' : 'No'}{user.isAdmin && ' (Admin)'} </td>
                                            <td>
                                                <button onClick={() => uploadedIssuesList(user._id)}>Click Here</button>
                                            </td>
                                            <td>
                                                <button disabled={currentUser.mobile == user.mobile || user.isAdmin} onClick={() => removeUser(user)}>Remove</button>
                                                <button disabled={currentUser.mobile == user.mobile || user.isAdmin} onClick={() => updateUser(user)}>Update</button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                                </> :<tr>
                                    <td colSpan={8}>No result found <Loader /> </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                        <hr style={{ border: '3px dashed #888' }} />
                        <div style={{ marginBlock: '20px' }}>
                            {
                                issuesList.length > 0 ? (
                                   <UserIssues issuesList={issuesList}/>
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

export default AdminPage