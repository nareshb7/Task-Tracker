import React, { useContext, useEffect, useState } from 'react'
import { fetchCall, fetchGetCall } from '../utils/fetch/UseFetch'
import { Table } from 'react-bootstrap'
import { UserContext } from '../../App'
import { useNavigate } from 'react-router-dom'
import TaskTable from '../reusable/table/Table'

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
    const headers = [
        {title:'Sl no', key:'serialNo'},
        {title: 'Dev Name', key:'user.name'},
        {title:'Team', key:'type'},
        {title:'Description', key:'description'},
        {title: 'Received Time', key:'createdAt', tdFormat:(request)=> <span>{new Date(request?.createdAt).toLocaleString()}</span>},
        {title:'Status', key:'status',}
    ]
  return (
    <div><h2>Bot Requests:</h2>
        <TaskTable headers={headers} tableData={requests} />
    </div>
  )
}

export default AdminBotPage