import React from 'react'
import axios from 'axios'

export const uploadedIssues =async (developerId, setIssuesList) => {
    axios.post('/api/uploadedIssues', { developerId })
        .then(data => setIssuesList(data.data))
        .catch(err => console.log(err, 'err'))
}

const UserIssues = ({issuesList}) => {
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
                                    <td>{issue.issue}</td>
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
