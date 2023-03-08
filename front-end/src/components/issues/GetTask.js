import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { UserContext } from '../../App'
import Loader from '../utils/loader/Loader'
import useRandomNum from '../utils/RandomNum'

const GetTask = () => {
    const stateIssues = useSelector(state => state.issues)
    console.log(stateIssues, 'stateIssues')
    const navigate = useNavigate()
    const { currentUserVal } = useContext(UserContext)
    const [currentUser, setCurrentUser] = useState({})
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
        sortNames.dName = [...new Set(data.map(val => val.dName))]
        sortNames.cName = [...new Set(data.map(val => val.cName))]
        sortNames.technology = [...new Set(data.map(val => val.technology))]
        sortNames.appType = [...new Set(data.map(val => val.appType))]
    }
    console.log(useRandomNum(), 'random get')

    const handleSort = (e) => {
        const { name, value } = e.target
        applyFilters[name] = value
        let result = []
        if (name === 'appType') {
            result = value === 'All' ? data : data.filter(val => val.appType === value)
            console.log(result, value)
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
    const editFunc = (id) => {
        console.log('Edit button clicekd', id)
    }
    const deleteFunc = (id) => {
        let cnfrm = window.confirm('Do you want to delete this issue??')
        if (cnfrm) {
            axios.post('/api/deletesolution', { id })
            .then(res => {
                const newData = data.filter(val => val._id !== res.data._id)
                setData(newData)
            })
            .catch(err => console.log(err, 'Error Occured during delete'))
        }
    }
    useEffect(() => {
        axios.get('/api/getData')
            .then(data => setData(data.data))
            .catch(err => console.log(err, 'err'))
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

    return (<>
        <h1>Get Task:</h1>
        {
            loading ? <h3>Loading....</h3> : <div>
                <table border='1' cellPadding={10}>
                    <thead>
                        <tr>
                            <th>Sl. No</th>
                            <th><div>Developer Name</div>
                                <select onClick={handleSort} defaultValue={applyFilters.dName} name='dName'>
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
                                <select onClick={handleSort} defaultValue={applyFilters.dName} name='cName'>
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
                                <select onClick={handleSort} defaultValue={applyFilters.dName} name='technology'>
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
                            <th>Application Type
                                <select onClick={handleSort} defaultValue={applyFilters.appType} name='appType'>
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
                            <th>Issue</th>
                            <th>Date</th>
                            <th>Image</th>
                            <th>Edit / Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            tableData.length ? <>{
                                tableData.reverse().map((val, idx) => {
                                    return (
                                        <tr key={idx}>
                                            <td>{idx + 1}</td>
                                            <td> {val.dName}</td>
                                            <td> {val.cName}</td>
                                            <td> {val.technology} </td>
                                            <td>{val.companyName ? val.companyName : 'No Data'}</td>
                                            <td>{val.appType ? val.appType : 'No Data'}</td>
                                            <td onClick={() => gotoDesc(val)}> {val.issueTitle}</td>
                                            <td> {new Date(val?.time).toLocaleString()}</td>
                                            <td><img src={val.binaryData[0] || val.binaryData} style={{ width: '100px', height: '100px' }} alt='img' /> </td>
                                            <td>
                                                <button onClick={() => editFunc(val._id)} disabled={currentUser._id !== val?.developerId}>Edit</button>
                                                <button onClick={() => deleteFunc(val._id)} disabled={currentUser._id !== val?.developerId} >Delete</button>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                            </> : <tr>
                                <td colSpan={11} > {tableData.length === 0 ? <h3 style={{ textAlign: 'center' }}>No result found</h3> : <Loader />} </td>
                            </tr>
                        }

                    </tbody>
                </table>
            </div>
        }
    </>

    )
}

export default GetTask