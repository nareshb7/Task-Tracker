import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { UserContext } from '../../App'

const GetAllUsers = () => {
    const { currentUserVal } = useContext(UserContext)
    const [users, setUsers] = useState([])
    const [issuesList, setIssuesList] = useState([])
    const [currentUser, setCurrentUser] = useState({})
    const [render, setRender] = useState(true)
    const [searchVal, setSearchVal] = useState('')
    const [tableData, setTableData] = useState([])
    useEffect(() => {
        axios.get('/api/getallusers')
            .then(data => setUsers(data.data))
            .catch(err => console.log(err, 'err'))
    }, [])
    useEffect(() => {
        setCurrentUser(currentUserVal)
    }, [currentUserVal])
    useEffect(()=> {
        setTableData(users)
    },[users])
    const uploadedIssues = (mobile) => {
        axios.post('/api/uploadedIssues', { mobile })
            .then(data => setIssuesList(data.data))
            .catch(err => console.log(err, 'err'))
    }
    const removeUser = (user) => {
        let cnfrm = window.confirm(`Do you want to delete ${user.fName}'s account ??`)
        if (cnfrm) {
            axios.post('/api/deleteuser', { id: user._id })
                .then(data => setRender(!render))
                .catch(err => console.log(err, 'err'))
        }
    }
    const updateUser = (user) => {
        console.log(user, 'update')
        let status = user.isActive
        let cnfrm = window.confirm(`If u click ok ${user.fName}'s account will be ${status ? 'no longer accessible' : "accessible"} `)
        if (cnfrm) {
            axios.post('/api/adminupdateuser', { id: user._id, status: status })
                .then(res => setRender(!render))
                .catch(err => console.log(err, 'err'))
        }
    }
    const sortFunc= (val)=> {
        let sortData = JSON.parse(JSON.stringify(users))
        sortData.sort((a,b)=> {
            if (a[val]> b[val]){
                return 1
            } if (a[val]< b[val]){
                return -1
            }
            return 0
        })
        console.log(sortData, 'sorted', val)
        setTableData(sortData)
    }
    return (
        <>{
            currentUser && currentUser.isAdmin ? <div>
                <h1>All Users : </h1>
                <div style={{textAlign:'end'}}>
                    <input style={{padding:'10px 20px', marginBlock :'10px'}} type='text' name='searchIpt' value={searchVal} onChange={(e)=> setSearchVal(e.target.value)} placeholder='search here...' /> 
                    <button style={{marginInline:'10px'}}>Search</button>
                </div>
                 {
                    users.length ? (<> <table cellPadding='10' style={{ textAlign: 'center' }} border='1'>
                        <thead>
                            <tr>
                                <th>Sl. No</th>
                                <th onClick={()=> sortFunc('fName')}>Name</th>
                                <th onClick={()=> sortFunc('email')}>Email</th>
                                <th onClick={()=> sortFunc('mobile')}>Mobile</th>
                                <th onClick={()=> sortFunc()}>Profile Image</th>
                                <th onClick={()=> sortFunc('isActive')}>Is Active</th>
                                <th onClick={()=> sortFunc()}>Uploaded Issues</th>
                                <th onClick={()=> sortFunc()}> Remove User</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                tableData.map((user, idx) => {
                                    return (
                                        <tr key={idx}>
                                            <td>{idx+1}</td>
                                            <td>{user.fName} {user.lName}</td>
                                            <td>{user.email}</td>
                                            <td>{user.mobile}</td>
                                            <td style={{ width: '100px', height: '100px' }}>
                                                <img src={user.binaryData} alt='image' style={{ width: '100%', height: '100%' }} />
                                            </td>
                                            <td> {user.isActive ? 'Yes' : 'No'}{user.isAdmin && ' (Admin)'} </td>
                                            <td>
                                                <button onClick={() => uploadedIssues(user.mobile)}>Click Here</button>
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
                        <div>
                            {
                                issuesList.length > 0 ? (
                                    <div>
                                        <h3>No of issues : {issuesList.length}</h3>
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