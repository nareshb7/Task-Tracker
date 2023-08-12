import React, { memo, useEffect, useState } from 'react'
import './table.css'
import TablePagination from './Pagination.js'

const TaskTable = memo((props) => {
    const {
        handleRowClick = () => { },
        headers = [],
        tableData = [],
        tHeadClassName = '',
        tBodyClassName = '',
        className = 'task-table',
        pagination = false,
        paginationAlign = 'center',
        paginationClassName = 'table-pagination',
        loader = { component: <>Loading..</>, loading: false },
        ...args
    } = props
    const dt = tableData.map((val, idx) => {
        return { ...val, serialNo: idx + 1 }
    })
    const [formattedData, setFormattedData] = useState(dt)
    const [currentPageData, setCurrentPageData] = useState([])
    useEffect(() => {
        setFormattedData(dt)
        pagination ? setCurrentPageData(dt.slice(0, 5)) : setCurrentPageData(dt)
    }, [tableData])
    const renderHeader = (header, idx) => {
        switch (header.node) {
            case 'select': {
                return <th className='table-head' key={idx}><span>{header.title}</span>
                    <select onChange={(e) => header?.onClick(e, header)} name={header.key}>
                        {
                            header?.values?.map((opt, idx) => <option key={idx} value={opt?.value}>{opt?.key || opt}</option>)
                        }
                    </select>
                </th>
            }
            default: return <th key={idx}><div onClick={header.onClick} className='table-thead'>
                <span>{header.title} </span>
                {
                    header.sort && <div className='sort-fields'>
                        <span title='Ascending order' onClick={() => header?.sort(header.key, 'asc')}> &and;</span>
                        <span title='Descending order' onClick={() => header?.sort(header.key, 'desc')}> &or;</span>
                    </div>
                }
            </div>
            </th>
        }
    }
    const renderBodyRow = (obj, idx) => {
        return <tr className='table-body' onClick={() => handleRowClick(obj)} key={idx} >
            {
                headers.map((val1, index) => {
                    if (val1?.key == 'serialNo') {
                        return <td key={index}>{obj.serialNo}. </td>
                    }
                    const hasOption = !val1.tdFormat && val1?.key.split('.')
                    return val1.tdFormat ?
                        <td key={index}>
                            {val1.tdFormat(obj)}
                        </td> :
                        <td key={index}>
                            {hasOption.length == 1 ? obj[val1.key] : obj[hasOption[0]]?.[hasOption[1]]}
                        </td>
                })
            }
        </tr>
    }
    return (<>
        <table className={className} {...args}>
            <thead className={tHeadClassName}>
                <tr className='table-header'>
                    {headers.map((header, idx) => renderHeader(header, idx))}
                </tr>
            </thead>
            <tbody className={tBodyClassName}>
                {
                    loader.loading ? <tr><td colSpan={headers.length}>{loader.component ? loader.component : <div>Loading...</div>}</td></tr> :
                        currentPageData.map((obj, idx) => renderBodyRow(obj, idx))
                }
            </tbody>
        </table>
        {
            pagination && <TablePagination paginationClassName={paginationClassName} paginationAlign={paginationAlign} tableData={formattedData} setCurrentPageData={setCurrentPageData} />
        }
    </>
    )
})

export default TaskTable