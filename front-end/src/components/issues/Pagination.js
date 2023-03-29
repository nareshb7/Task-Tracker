import React, { useEffect, useState } from 'react'
import { GreenDot, RedDot } from '../utils/Dots/Dots'
import { issueStatusFunc } from './Description'

const Pagination = (props) => {
    const { data, gotoDesc, editFunc, deleteFunc, currentUser }= props
    const [currentData, setCurreentData] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [pageSize, setPageSize] = useState(5)
    const lastPage = parseInt(data.length / pageSize);
    useEffect(() => {
        setCurreentData(data.slice(currentPage * pageSize, currentPage * pageSize + pageSize))
    }, [currentPage, pageSize, data])
    const showDataFunc = (page, operator) => {
        switch (operator) {
            case '-':
                page <= 0 ? setCurrentPage(0) : setCurrentPage(page - 1);
                break;
            case '+':
                page >= lastPage ? setCurrentPage(lastPage) : setCurrentPage(page + 1);
                break;
            default:
                return;
        }
    };
    const handlePagesizeChange = (e) => {
        console.log('handleChange', e.target.value)
        setPageSize(Number(e.target.value))
        setCurrentPage(0)
    }
    return <tbody>
        {
            currentData.map((val, idx) => {
                let id = currentPage * pageSize + idx + 1
                return <tr key={idx}>
                    <td>{id}</td>
                    <td> {val.dName}</td>
                    <td> {val.cName}</td>
                    <td> {val.technology} </td>
                    <td>{val.companyName ? val.companyName : 'Data not available'}</td>
                    <td>{val.appType ? val.appType : 'No Data'}</td>
                    <td style={{ cursor: 'pointer' }} title={'Click here to get full info.'} onClick={() => gotoDesc(val)}> {val.issueTitle}</td>
                    <td> {issueStatusFunc(val.issueStatus)} </td>
                    <td> {new Date(val?.time).toLocaleString()}</td>
                    <td><img src={val.binaryData[0] || val.binaryData} style={{ width: '100px', height: '100px' }} alt='img' />{val.binaryData.length > 1 && 'more....'} </td>
                    <td>
                        <button onClick={() => editFunc(val._id, val)} disabled={currentUser._id !== val?.developerId}>Edit</button>
                        <button onClick={() => deleteFunc(val._id)} disabled={currentUser._id !== val?.developerId} >Delete</button>
                    </td>
                </tr>
            })
        }
        <tr>
            <td colSpan={6}>.....</td>
            <td >
                <div>
                    <label>Select page Size</label>
                    <select onChange={handlePagesizeChange} defaultValue={pageSize}>
                        <option value={5}>5 rows</option>
                        <option value={10}>10 rows</option> 
                    </select>
                </div>
            </td>
            <td colSpan={4}>
                <button disabled={currentPage === 0} onClick={() => showDataFunc(currentPage, '-')}> Back </button>
            
                <span> {currentPage + 1} </span>
           
                <span> of Page : {lastPage + 1} </span>
            
                <button disabled={currentPage === lastPage} onClick={() => showDataFunc(currentPage, '+')}> Next </button>
            </td>
            
        </tr>
    </tbody>
}

export default Pagination
