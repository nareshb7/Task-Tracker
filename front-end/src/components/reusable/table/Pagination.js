import React, { memo, useEffect, useState } from 'react'

const TablePagination = memo(({ tableData, setCurrentPageData, paginationAlign, paginationClassName }) => {
    const defaultPageSize = 5;
    const [pageSize, setPageSize] = useState(defaultPageSize)
    const [currentPageIndex, setCurrentPageIndex] = useState(0)
    const dataLength = tableData.length
    const pagesLength = [...Array(Math.ceil(dataLength / pageSize)).keys()]
    const lastPage = pagesLength.findLast(v => v) || 0
    const renderPageSizeOptions = () => {
        if (dataLength > 50) return [5, 10, 20, 50, dataLength]
        else if (dataLength > 20) return [5, 10, 20, dataLength]
        else if (dataLength > 10) return [5, 10, dataLength]
        else if (dataLength > 5) return [5, dataLength]
        return [5, 10, 15, 20]
    }
    // console.log('PAGES',{ pagesLength, tableData, currentPageIndex, pageSize, lastPage})
    const handlePageSizeChange = (e) => {
        setCurrentPageIndex(0)
        setPageSize(e.target.value)
    }
    const previousFunc = () => {
        setCurrentPageIndex(currentPageIndex - 1)
    }
    const nextFunc = () => {
        setCurrentPageIndex(currentPageIndex + 1)
    }
    useEffect(() => {
        let currentData = tableData.slice(currentPageIndex * pageSize, currentPageIndex * pageSize + Number(pageSize))
        setCurrentPageData(currentData)
    }, [pageSize, currentPageIndex, tableData])
    return (
        <div className={paginationClassName} style={{ justifyContent: paginationAlign }}>
            <button className='prev-btn' disabled={currentPageIndex == 0} onClick={previousFunc} >Prev</button>
            {
                pagesLength.map((page, idx) => <span className={`${currentPageIndex == page && 'selected'}`} onClick={() => setCurrentPageIndex(page)} key={idx}>{page + 1}</span>)
            }
            <button disabled={currentPageIndex == lastPage} className='next-btn' onClick={nextFunc}>Next</button>
            {
                defaultPageSize && <select onChange={handlePageSizeChange} className='table-pagesize-dropdown'>
                    {
                        renderPageSizeOptions().map((val, idx) => <option key={idx}>{val}</option>)
                    }
                </select>
            }
        </div>
    )
})

export default TablePagination