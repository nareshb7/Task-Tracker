import React, { memo } from 'react'
import { data, headersData, defaultTdFormat } from './tableMockData'
import './table.css'

const TaskTable = memo((props) => {
    const {
        handleRowClick = () => { },
        headers = [],
        tableData = [],
        loading = false,
        tHeadClassName = '',
        tBodyClassName = '',
        className = 'task-table',
        ...args
    } = props
    const renderHeader = (header, idx) => {
        switch (header.node) {
            case 'select': {
                return <th key={idx}><span>{header.title}</span>
                    <select onChange={(e)=> header?.onClick(e, header)}>
                        {
                            header?.values?.map((opt, idx) => <option key={idx} value={opt?.value}>{opt?.key || opt}</option>)
                        }
                    </select>
                </th>
            }
            default: return <th key={idx} onClick={header.onClick}><span>{header.title}</span></th>
        }
    }
    const renderBodyRow = (obj, idx) => {
        return <tr onClick={() => handleRowClick(obj)} key={idx} >
            {
                headers.map((val1, index) => {
                    if (val1?.key == 'serialNo') {
                        return <td key={index}>{idx + 1}. </td>
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
    return (
        <table className={className} {...args}>
            <thead className={tHeadClassName}>
                <tr>
                    {headers.map((header, idx) => renderHeader(header, idx))}
                </tr>
            </thead>
            <tbody className={tBodyClassName}>
                {
                    loading ? <tr><td colSpan={headers.length}>Loading...</td></tr> :
                        tableData.map((obj, idx) => renderBodyRow(obj, idx))
                }
            </tbody>
        </table>
    )
})

export default TaskTable