import React, {useContext} from 'react'
import { Table } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { fetchCall } from '../utils/fetch/UseFetch'
import { UserContext } from '../../App'
import { GreenDot, RedDot } from '../utils/Dots/Dots'
import { issueStatusFunc } from './Description'

export const uploadedIssues =async (developerId) => {
    const response = await fetchCall('api/uploadedIssues', {developerId})
    return response
}
const UserIssues = ({issuesList}) => {
    const {currentUserVal} = useContext(UserContext)
    const navigate = useNavigate()
    const gotoDesc = (val) => {
        navigate(`/description`, { state: val })
    }
    const handleStatusChange =(e)=> {
        console.log(e.target.value) 
    }
    return (
        <div>{
            issuesList.length ? <Table border='1' striped hover >
            <caption>Uploaded Issues</caption>
            <thead>
                <tr>
                    <th>Developer Name</th>
                    <th>Client Name</th>
                    <th>Technology</th>
                    <th>Issue</th>
                    <th>Issue Status</th>
                    <th>Updated Time</th>
                </tr>
            </thead>
            <tbody>
                {
                    issuesList.reverse().map((issue, idx) => {
                        return (
                            <tr key={idx}>
                                <td>{issue.dName}</td>
                                <td>{issue.cName}</td>
                                <td>
                                    <span>{issue.issueStatus === 'Resolved' ? 
                                        <GreenDot title='Resolved' /> : 
                                        <RedDot title='Pending'/>} 
                                    </span> 
                                    <span>{issue.technology} </span>
                                </td>
                                <td style={{cursor:'pointer'}} title='Click here to check total Description' onClick={() => gotoDesc(issue)}>{issue.issue}</td>
                                <td>
                                    <div>
                                        {issue.developerId === currentUserVal._id && issue.issueStatus === 'Pending' ? 
                                        <select defaultValue={issue.issueStatus} onChange={handleStatusChange}>
                                            <option>''</option>
                                            <option value='Pending'>Pending</option>
                                            <option value='Resolved'>Resolved</option>
                                            <option value='Fixed'> Fixed</option>
                                        </select>
                                        : (<span> {issue.issueStatus ? issueStatusFunc(issue.issueStatus) : 'Null'}</span>)
                                        }
                                    </div>
                                </td>
                                <td>{new Date(issue.time).toLocaleString()}</td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table> : <h3>No Issues added</h3>
            }
            
        </div>
    )
}

export default UserIssues
