import React, { useEffect, useState } from 'react'
import axios from 'axios'

const GetTask = () => {
    const [data, setData] = useState([])
    const [tableData, setTableData] = useState([])
    useEffect(() => {
        axios.get('http://localhost:4040/getData')
            .then(data => setData(data.data))
            .catch(err => console.log(err, 'err'))
    }, [])
    const technologies = new Set(data.map(val=> val.technology))
    const tech = []
    technologies.forEach(val  => {
        tech.push(val)
    })
    useEffect(()=> {
        console.log('useeffcet')
        setTableData(data)
    },[data])
    
    const handleClick = (e)=> {
        const {name, value} = e.target
        console.log(name, value)
        let sortData = data.filter(val => value !=='All' ?  val.technology == value : value)
        setTableData(sortData)
    }
    console.log(data, 'data')
    return (
        <div>
            <h1>Get Task:</h1>
            <table border='1' cellPadding={10}>
                <thead>
                    <tr>
                        <th>Sl. No</th>
                        <th>Developer Name</th>
                        <th>Client Name</th>
                        <th>Technology
                            <select onClick={handleClick} name='technology'>
                                <option>All</option>
                                {
                                    tech.map((val, idx)=> {
                                        return (
                                            <option key={idx} value={val}>{val}</option>
                                        )
                                    })
                                }
                            </select>
                        </th>
                        <th>Issue</th>
                        <th>Date</th>
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
                                    <td> {val.issue}</td>
                                    <td> {val?.time}</td>
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