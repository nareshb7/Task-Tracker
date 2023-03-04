import React from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export const uploadedIssues = (developerId) => {
     const response =  axios.post('/api/uploadedIssues', { developerId })
    .then(data => {
        return data.data
    })
    .catch(err => console.log(err, 'err'))
    return response
}
const UserIssues = ({issuesList}) => {
    const navigate = useNavigate()
    const gotoDesc = (val) => {
        navigate(`/description`, { state: val })
    }
    return (
        <div>
            <table border='1'>
                <caption>Uploaded Issues</caption>
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
                                    <td style={{cursor:'pointer'}} onClick={()=> gotoDesc(issue)}>{issue.issue}</td>
                                    <td>{new Date(issue.time).toLocaleString()}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default UserIssues
