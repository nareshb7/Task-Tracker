import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import Loader from '../components/utils/loader/Loader'
import './style/IssueList.css'
import { addActivity } from './activityPage/ActivityPage'
import { fetchGetCall } from '../components/utils/fetch/UseFetch'
import { debounce } from '../components/utils/Debounce'
import { issueStatusFunc } from '../components/issues/Description'
import { dateIndicator } from './chatBox/MessageBox'
import { Button } from 'react-bootstrap'
import TaskTable from '../components/reusable/table/Table'

const Tickets = () => {
    const navigate = useNavigate()
    const { currentUserVal } = useContext(UserContext)
    const [searchVal, setSearchVal] = useState('')
    const [data, setData] = useState([])
    const [tableData, setTableData] = useState([])
    const [loading, setLoading] = useState(true)
    const [sortNames, setSortNames] = useState({
        dName: [],
        cName: [],
        technology: [],
        appType: []
    })
    const [applyFilters, setApplyFilters] = useState({
        dName: 'All',
        cName: 'All',
        technology: 'All',
        appType: 'All'
    })
    const sortList = () => {
        sortNames.dName = ["All",...new Set(data.map(val => val.dName))].sort()
        sortNames.cName = ["All",...new Set(data.map(val => val.cName))].sort()
        sortNames.technology = ["All",...new Set(data.map(val => val.technology))].sort()
        sortNames.appType = ["All",...new Set(data.map(val => val.appType))].sort()
    }
    const handleSort = (e) => {
        setSearchVal('')
        console.log('SORT', e.target.value, e.target.name)
        const { name, value } = e.target
        applyFilters[name] = value
        let result = []
        if (name === 'appType') {
            result = value === 'All' ? data : data.filter(val => val.appType === value)
        } else {
            applyFilters.appType = 'All'
            result = data.filter(val => {
                if ((applyFilters.dName === 'All' ? val.dName : val.dName === applyFilters.dName) &&
                    (applyFilters.cName === 'All' ? val.cName : val.cName === applyFilters.cName) &&
                    (applyFilters.technology === 'All' ? val.technology : val.technology === applyFilters.technology)
                ) {
                    return val
                }
            })
        }
        setTableData(result)
    }
    const gotoDesc = (val) => {
        navigate(`/description`, { state: val })
    }
    const editFunc = (id, data) => {
        navigate('/addIssue', { state: { data, mode: 'UPDATE' } })
    }
    const deleteFunc = (id) => {
        let cnfrm = window.confirm('Do you want to delete this ticket??')
        setLoading(true)
        if (cnfrm) {
            axios.post('/api/deletesolution', { id })
                .then(res => {
                    const newData = data.filter(val => val._id !== res.data._id)
                    setData(newData)
                    addActivity(currentUserVal, 'Tickets page', `Ticket Deleted ${id}`)
                })
                .catch(err => setLoading(false))
        }
        setLoading(false)
    }
    const handleSearch = debounce((e) => {
        const { value } = e.target
        const searchData = data.filter(val => {
            if (val.cName.toLowerCase().includes(value.toLowerCase()) || val.dName.toLowerCase().includes(value.toLowerCase()) || val.technology.toLowerCase().includes(value.toLowerCase())) {
                return val
            }
        })
        console.log('Search', value)
        setTableData(searchData)
        addActivity(currentUserVal, 'Tickets page', `Performed search operation`)
    })
    const getTickets = async () => {
        setLoading(true)
        const { success, data } = await fetchGetCall('/api/getData')
        if (success) {
            setData(data)
        }
        setLoading(false)
    }
    useEffect(() => {
        addActivity(currentUserVal, 'Tickets page', `Visited tickets page`)
        getTickets()
    }, [])

    useEffect(() => {
        if (data.length) {
            setTableData(data)
            sortList()
        }
    }, [data])
    const tHeaders = [
        {title: "Sl. No", key:'serialNo'},
        {title:'Developer Name', key:'dName', node:'select', values: sortNames.dName, onClick: handleSort },
        {title:'Client Name', key:'cName', node:'select', values: sortNames.cName, onClick: handleSort},
        {title:'Technology', key:'technology', node:'select', values: sortNames.technology, onClick: handleSort},
        {title:'Company Name', key:'', tdFormat: (val)=> <span>{val.companyName ? val.companyName : 'Data not available'}</span>},
        {title:'Application Type', key:'appType',tdFormat: (val)=> <span>{val.appType ? val.appType : 'No Data'}</span>, node:'select', values: sortNames.appType, onClick: handleSort},
        {title:'Description (Click)', key:'', tdFormat: (val)=> <span style={{ cursor: 'pointer' }} title={'Click here to get full info.'} onClick={()=> gotoDesc(val)}>{val.issueTitle}</span>},
        {title:'Ticket Status', key:'', tdFormat: (val)=> <span>{issueStatusFunc(val.issueStatus)}</span>},
        {title:'Updated Date', key:'', tdFormat: (val)=> <span>{dateIndicator(val?.time) }</span>},
        {title:'Last Update', key:'', tdFormat: (val)=> <span>{dateIndicator(val.solutions.slice(-1)[0].updatedTime || val?.time)}</span>},
        {title:'Image', key:'', tdFormat: (val)=> <span><img className='img' src={val.binaryData[0] || val.binaryData}  alt='img' />{val.binaryData.length > 1 && 'more....'} </span>},
        {title:'Edit/ Delete', key:'', tdFormat: (val)=> <><Button variant='warning' onClick={() => editFunc(val._id, val)} disabled={currentUserVal._id !== val?.developerId}>Edit <i className='fas fa-edit'></i></Button>
        <Button variant='danger' onClick={() => deleteFunc(val._id)} disabled={!currentUserVal.isAdmin} >Delete <i className='fas fa-trash'></i></Button></>},
    ]

    return (<div className='bgi' style={{ color: '#eee' }}>
        <div className='issueList-main'>
            <h1 style={{ color: '#000' }}>Uploaded Ticket's: </h1>
            <div>
                <input className='searchIpt' type='search' value={searchVal} onChange={(e)=> {handleSearch(e); setSearchVal(e.target.value)}} placeholder='Search Here' />
            </div>
        </div>
        {
            loading ? <h3><Loader /></h3> :
                <TaskTable 
                headers={tHeaders} 
                tableData={tableData} 
                pagination 
                className='table'
                />
        }
    </div>

    )
}

export default Tickets