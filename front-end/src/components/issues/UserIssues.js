import React, { useContext } from 'react'
import { Table } from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { fetchCall } from '../utils/fetch/UseFetch'
import { UserContext } from '../../App'
import { GreenDot, RedDot } from '../utils/Dots/Dots'
import { issueStatusFunc } from './Description'
import TaskTable from '../reusable/table/Table'

export const uploadedIssues = async (developerId) => {
    const response = await fetchCall('api/uploadedIssues', { developerId })
    return response
}
const UserIssues = ({ issuesList }) => {
    const { currentUserVal } = useContext(UserContext)
    const navigate = useNavigate()
    const gotoDesc = (val) => {
        navigate(`/description`, { state: val })
    }
    const handleStatusChange = (e) => {
        console.log(e.target.value)
    }
    const tHeaders = [
        { title: 'Developer Name', key: 'dName' },
        { title: 'Client Name', key: 'cName' },
        {
            title: 'Technology', key: '', tdFormat: (issue) => <><span>
                {issue.issueStatus === 'Resolved' ?
                    <GreenDot title='Resolved' /> :
                    <RedDot title='Pending' />}
            </span>
                <span>{issue.technology} </span></>
        },
        { title: 'Requirement', key: 'issue', tdFormat: (issue) => <span onClick={() => gotoDesc(issue)}>{issue.issue}</span> },
        {
            title: 'Ticket Status', key: '', tdFormat: (issue) => <div>
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
        },
        { title: 'Updated Time', key: '', tdFormat: (issue) => <>{new Date(issue.time).toLocaleString()}</> },
    ]
    return <>{issuesList.length ?
        <TaskTable headers={tHeaders} tableData={issuesList.reverse()} /> : <h3>No ISsues added</h3>
    }</>
}

export default UserIssues
