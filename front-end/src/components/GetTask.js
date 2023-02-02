import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import useAuth from './authentication/Authentication'

const GetTask = () => {
    const navigate = useNavigate()
    const currentUse = useAuth()
    const [currentUser, setCurrentUser] = useState({})
    const [data, setData] = useState([])
    const [tableData, setTableData] = useState([])
    useEffect(() => {
        axios.get('/api/getData')
            .then(data => setData(data.data))
            .catch(err => console.log(err, 'err'))
    }, [])

    useEffect(()=> {
        setCurrentUser(currentUse)
    },[currentUse])
    const technologies = new Set(data.map(val => val.technology))
    const tech = []
    technologies.forEach(val => {
        tech.push(val)
    })
    useEffect(() => {
        setTableData(data)
        console.log(data, 'data')
    }, [data])

    const handleClick = (e) => {
        const { name, value } = e.target
        console.log(name, value)
        let sortData = data.filter(val => value !== 'All' ? val.technology === value : value)
        setTableData(sortData)
    }
    const gotoDesc = (val) => {
        navigate(`/description`, { state: val })
    }
    const editFunc =()=> {
        console.log('Edit button clicekd')
    }
    const deleteFunc =()=> {
        console.log('delete button Clicekd')
    }
    return (
        <div>
            <h1>Get Task:</h1>
            <table border='1' cellPadding={10}>
                <thead>
                    <tr>
                        <th>Sl. No</th>
                        <th>Developer Name</th>
                        <th>Client Name</th>
                        <th><div>Technology</div>
                            <select onClick={handleClick} name='technology'>
                                <option>All</option>
                                {
                                    tech.map((val, idx) => {
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
                        tableData.map((val, idx) => {
                            return (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td> {val.dName}</td>
                                    <td> {val.cName}</td>
                                    <td> {val.technology} </td>
                                    <td onClick={() => gotoDesc(val)}> {val.issueTitle}</td>
                                    <td> {val?.time}</td>
                                    <td><img src={val.binaryData} style={{width:'100px', height:'100px'}} alt='img' /> </td>
                                    <td>
                                        <button onClick={editFunc} disabled={currentUser.mobile !== val.mobile}>Edit</button>
                                        <button onClick={deleteFunc} disabled={currentUser.mobile !== val.mobile}>Delete</button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default GetTask