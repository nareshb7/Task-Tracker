import React, {useEffect, useState} from 'react'
import axios from 'axios'
import useAuth from '../authentication/Authentication'
import { NavLink } from 'react-router-dom'

const GetAllUsers = () => {
    const currentUser = useAuth()
    const [users,setUsers] = useState([])
    const [issuesList, setIssuesList] = useState([])
    useEffect(()=> {
        axios.get('/api/getallusers')
        .then(data => setUsers(data.data))
        .catch(err => console.log(err, 'err'))
    },[])
    const uploadedIssues =(mobile)=> {
        axios.post('/api/uploadedIssues', {mobile})
        .then(data => setIssuesList(data.data))
        .catch(err => console.log(err, 'err'))
    }

  return (
    <div>
        <h1>All Users : </h1>
        <table cellPadding='10' style={{textAlign:'center'}} border='1'>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Profile Image</th>
                    <th>Is Active</th>
                    <th>Uploaded Issues</th>
                </tr>
            </thead>
            <tbody>
            {
            users.map((user, idx)=> {
                return (
                    <tr key={idx}>
                        <td>{user.fName} {user.lName}</td>
                        <td>{user.email}</td>
                        <td>{user.mobile}</td>
                        <td style={{width:'100px', height:'100px'}}>
                            <img src={user.binaryData} alt='image' style={{width:'100%', height:'100%'}} />
                        </td>
                        <td> Yes </td>
                        <td>
                            <button  onClick={()=> uploadedIssues(user.mobile)}>Click Here</button>
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
                ) :(
                    <h3>No Solutions Added</h3>
                )
            }
        </div>
    </div>
  )
}

export default GetAllUsers