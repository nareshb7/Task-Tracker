import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { UserContext } from '../App'
import Loader from '../components/utils/loader/Loader'
import Pagination from '../components/issues/Pagination'
import './style/IssueList.css'
import { addActivity } from './activityPage/ActivityPage'
import { fetchGetCall } from '../components/utils/fetch/UseFetch'

const GetTask = () => {
    const stateIssues = useSelector(state => state.issues)
    const navigate = useNavigate()
    const { currentUserVal } = useContext(UserContext)
    const [currentUser, setCurrentUser] = useState({})
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
        sortNames.dName = [...new Set(data.map(val => val.dName))].sort()
        sortNames.cName = [...new Set(data.map(val => val.cName))].sort()
        sortNames.technology = [...new Set(data.map(val => val.technology))].sort()
        sortNames.appType = [...new Set(data.map(val => val.appType))].sort()
    }
    const handleSort = (e) => {
        setSearchVal('')
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
        navigate('/addIssue', {state: {data, mode:'UPDATE'}})
    }
    const deleteFunc = (id) => {
        let cnfrm = window.confirm('Do you want to delete this ticket??')
        if (cnfrm) {
            axios.post('/api/deletesolution', { id })
                .then(res => {
                    const newData = data.filter(val => val._id !== res.data._id)
                    setData(newData)
                    addActivity(currentUserVal, 'Tickets page', `Ticket Deleted ${id}`)
                })
                .catch(err => console.log(err, 'Error Occured during delete'))
        }
    }
    const handleSearch = (e)=> {
        const {value} = e.target
        setSearchVal(value)
        let mockData = value ? data : data
        const searchData = mockData.filter(val => {
            if(val.cName.toLowerCase().includes(value.toLowerCase()) || val.dName.toLowerCase().includes(value.toLowerCase()) || val.technology.toLowerCase().includes(value.toLowerCase()) ){
                return val
            }
        })
        console.log('Search',searchData,value)
        setTableData(searchData)
        addActivity(currentUserVal, 'Tickets page', `Performed search operation`)
    }
    const getTickets =async ()=> {
        const {success, data} = await fetchGetCall('/api/getData')
        if (success) {
            setData(data)
        }
    }
    useEffect(() => {
        addActivity(currentUserVal, 'Tickets page', `Visited tickets page`)
        getTickets()
    }, [])

    useEffect(() => {
        if (data.length) {
            setTableData(data)
            setLoading(false)
            sortList()
        } else {
            setLoading(true)
        }
    }, [data])

    useEffect(() => {
        if (Object.keys(currentUserVal).length > 2) {
            setCurrentUser(currentUserVal)
            setLoading(false)
        }
    }, [currentUserVal])
    
    return (<div className='bgi' style={{color:'#eee'}}>
    <div className='issueList-main'>
        <h1 style={{color:'#000'}}>Uploaded Ticket's: </h1>
        <div>
            <input className='searchIpt' type='search' value={searchVal} onChange={handleSearch} placeholder='Search Here' />
        </div>
        </div>
        {
            loading ? <h3>Loading....</h3> : <div >
                <table border='1' cellPadding={10} className='table table-striped table-hover'>
                    <thead className='thead-dark'>
                        <tr>
                            <th scope='col'>Sl. No</th>
                            <th><div>Developer Name</div>
                                <select className='form-control' onClick={handleSort} defaultValue={applyFilters.dName} name='dName'>
                                    <option value='All'>All</option>
                                    {
                                        sortNames.dName.map((val, idx) => {
                                            return (
                                                <option key={idx} value={val}>{val}</option>
                                            )
                                        })
                                    }
                                </select>
                            </th>
                            <th><div>Client Name</div>
                                <select className='form-control' onClick={handleSort} defaultValue={applyFilters.dName} name='cName'>
                                    <option value='All'>All</option>
                                    {
                                        sortNames.cName.map((val, idx) => {
                                            return (
                                                <option key={idx} value={val}>{val}</option>
                                            )
                                        })
                                    }
                                </select>
                            </th>
                            <th><div>Technology</div>
                                <select className='form-control' onClick={handleSort} defaultValue={applyFilters.dName} name='technology'>
                                    <option value='All'>All</option>
                                    {
                                        sortNames.technology.map((val, idx) => {
                                            return (
                                                <option key={idx} value={val}>{val}</option>
                                            )
                                        })
                                    }
                                </select>
                            </th>
                            <th>CompanyName</th>
                            <th><span className='form-label'>Application Type</span>
                                <select className='form-control' onClick={handleSort} defaultValue={applyFilters.appType} name='appType'>
                                    <option value='All'>All</option>
                                    {
                                        sortNames.appType.map((val, idx) => {
                                            return (
                                                <option key={idx} value={val}>{val}</option>
                                            )
                                        })
                                    }
                                </select>
                            </th>
                            <th>Requirement ( click to know more)</th>
                            <th>Ticket status</th>
                            <th>Date</th>
                            <th>Last Updated</th>
                            <th>Image</th>
                            <th>Edit / Delete</th>
                        </tr>
                    </thead>
                        {
                            tableData.length ? <>
                            
                            <Pagination currentUser={currentUser} data={tableData} gotoDesc={gotoDesc} editFunc={editFunc} deleteFunc={deleteFunc} />
                            </> : <tbody><tr>
                                <td colSpan={11} > {tableData.length === 0 ? <h3 style={{ textAlign: 'center' }}>No result found</h3> : <Loader />} </td>
                            </tr></tbody>
                        }
                </table>
            </div>
        }
    </div>

    )
}

export default GetTask