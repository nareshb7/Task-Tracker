import React, { useEffect, useState } from 'react'
import { GreenDot, RedDot } from '../utils/Dots/Dots'
import { issueStatusFunc } from './Description'
import './Pagination.css'
import { Button } from 'react-bootstrap'

const Pagination = (props) => {
    const { data, gotoDesc, editFunc, deleteFunc, currentUser }= props
    const [currentData, setCurreentData] = useState([])
    const [currentPage, setCurrentPage] = useState(0)
    const [pageSize, setPageSize] = useState(5)
    const lastPage = parseInt(data.length / pageSize);
    useEffect(()=> {
        setCurrentPage(0)
        setPageSize(5)
    }, [data])
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
        setPageSize(Number(e.target.value))
        setCurrentPage(0)
    }
    return <tbody className='pagination-main'>
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
                    <td><img src={val.binaryData[0] || val.binaryData} className='img' alt='img' />{val.binaryData.length > 1 && 'more....'} </td>
                    <td>
                        <Button variant='warning' onClick={() => editFunc(val._id, val)} disabled={currentUser._id !== val?.developerId}>Edit <i className='fas fa-edit'></i></Button>
                        <Button variant='danger' onClick={() => deleteFunc(val._id)} disabled={currentUser._id !== val?.developerId} >Delete <i className='fas fa-trash'></i></Button>
                    </td>
                </tr>
            })
        }
        <tr>
            <td colSpan={6}>.....</td>
            <td >
                <div>
                    <label className='form-label'>Select page Size</label>
                    <select className='form-control' onChange={handlePagesizeChange} value={pageSize} >
                        <option value={5}>5 rows</option>
                        <option value={10}>10 rows</option> 
                    </select>
                </div>
            </td>
            <td colSpan={4}>
                <Button disabled={currentPage === 0} onClick={() => showDataFunc(currentPage, '-')}> Back </Button>
                <span> {currentPage + 1} </span>
                <span> of Page : {lastPage + 1} </span>
                <Button disabled={currentPage === lastPage} onClick={() => showDataFunc(currentPage, '+')}> Next </Button>
            </td>
            
        </tr>
    </tbody>
}

export default Pagination
