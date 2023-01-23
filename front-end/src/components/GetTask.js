import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const GetTask = () => {
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [tableData, setTableData] = useState([])
    useEffect(() => {
        axios.get('http://localhost:3000/getData')
            .then(data => setData(data.data))
            .catch(err => console.log(err, 'err'))
    }, [])
    const technologies = new Set(data.map(val => val.technology))
    const tech = []
    technologies.forEach(val => {
        tech.push(val)
    })
    useEffect(() => {
        setTableData(data)
        console.log(data, 'data')
    }, [data])
    const getImage = async () => {
        // const buffer = tableData.length &&  await tableData[0].image.arrayBuffer();
        // const binaryString = Array.from(new Uint8Array(buffer), byte => String.fromCharCode(byte)).join("");
        // const theImage = btoa(binaryString);
        // console.log(theImage, 'theImage')
    }
    getImage()

    const handleClick = (e) => {
        const { name, value } = e.target
        console.log(name, value)
        let sortData = data.filter(val => value !== 'All' ? val.technology === value : value)
        setTableData(sortData)
    }
    const gotoDesc = (val) => {
        navigate(`/description`, { state: val })
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
                        <th>Technology
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
                    </tr>
                </thead>
                <tbody>
                    {
                        tableData.map((val, idx) => {
                            const base64String = btoa(String.fromCharCode(...new Uint8Array(val.image.data.data)))
                            return (
                                <tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td> {val.dName}</td>
                                    <td> {val.cName}</td>
                                    <td> {val.technology} </td>
                                    <td onClick={() => gotoDesc(val)}> {val.issue}</td>
                                    <td> {val?.time}</td>
                                    <td><img src={`data: image/png;base64,${base64String}`} style={{width:'100px', height:'100px'}} alt='img' /> </td>
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