import React, { useContext, useEffect, useState } from 'react'
import { fetchCall, fetchGetCall } from '../utils/fetch/UseFetch'
import { Table } from 'react-bootstrap'
import { UserContext } from '../../App'
import { useNavigate } from 'react-router-dom'

const AdminBotPage = () => {
    const {currentUserVal, socket } = useContext(UserContext)
    const navigate = useNavigate()
    const [requests,setRequests] = useState([])
    socket.off('new-bot-request-added').on('new-bot-request-added', (request)=> {
        if (currentUserVal.isAdmin) {
            console.log('REQUEST', request)
            setRequests([...requests, request])
            alert('Bot Request')
        }
    })
    const getRequests =async ()=> {
        const resp = await fetchGetCall('/api/getbotrequests')
        if (resp.success) {
            setRequests(resp.data)
        }
        console.log('RESPONSE REQUESTS', resp)
    }
    const rowClick =async (rowData) => {
        let path='/adminpage'
        let state =''
        const pathType = rowData.type.toLowerCase()
        const adminPageTypes = ['email update', 'mobile number update']
        const chatTypes = ['it team message']
        if (adminPageTypes.includes(pathType)) {
            path='/adminpage'
            state = await fetchCall('/api/getparticularuser', {id: rowData.user.id})
            state.popup = 'EMPMODAL'
        } else if (chatTypes.includes(pathType)) {
            path= '/chat'
            state= await fetchCall('/api/getparticularuser', {id: rowData.user.id})
        }

        navigate(path, {state})
    }
    useEffect(()=> {
        getRequests()
    },[])
  return (
    <div><h2>Bot Requests:</h2>
        <Table striped hover>
            <thead>
                <tr>
                    <th>Dev Name</th>
                    <th>Team</th>
                    <th>Description</th>
                    <th>Received Time</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {
                    requests.map((request, idx)=> (
                        <tr key={idx} onClick={() => rowClick(request)}>
                            <td>{request.user.name}</td>
                            <td>{request.type}</td>
                            <td>{request.description}</td>
                            <td>{new Date(request?.createdAt).toLocaleString()}</td>
                            <td>{request?.status}</td>
                        </tr>
                    ))
                }
            </tbody>
        </Table>
    </div>
  )
}

export default AdminBotPage