import React, { useEffect, useState , useContext} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../App'

const GetTask = () => {
    const navigate = useNavigate()
    const {currentUserVal } = useContext(UserContext)
    const [currentUser, setCurrentUser] = useState({})
    const [data, setData] = useState([])
    const [tableData, setTableData] = useState([])
    const [loading,setLoading] = useState(true)
    const [sortNames , setSortNames] = useState({
        dName: [],
        cName :[],
        technology:[]
    })
    const [applyFilters, setApplyFilters] = useState({
        dName: 'All',
        cName :'All',
        technology:'All'
    })
    const sortList =()=> {
        sortNames.dName = [...new Set(data.map(val => val.dName))]
        sortNames.cName = [...new Set(data.map(val=> val.cName))]
        sortNames.technology = [...new Set(data.map(val => val.technology))]
    }

    const handleClick = (e) => {
        const { name, value } = e.target
        // setApplyFilters({...applyFilters,[name]: value})
        applyFilters[name] = value
        console.log(name, value)
         let sortData =  data.filter(val => value !== 'All' ? val[name] === applyFilters[name] : value)
        let sortedData =  data.filter(val => {
            // if (applyFilters['cName'] == val.cName && applyFilters['technology'] == val.technology){
            //     console.log('cName972==', val.cName, val.dName, val.technology)
            //    //return val['cName'] == applyFilters.cName
            //    return val
            // }
           return  Object.values(applyFilters).includes(val.dName && val.cName)
            // return val
            
        } )
        console.log(sortedData, '972==sorted', applyFilters)


        setTableData(sortData)
    }
    console.log(applyFilters, 'applyFilters...')
    const gotoDesc = (val) => {
        navigate(`/description`, { state: val })
    }
    const editFunc =(id)=> {
        console.log('Edit button clicekd', id)
    }
    const deleteFunc =(id)=> {
        console.log('delete button Clicekd', id)
        axios.post('/api/deletesolution', {id})
        .then(data => console.log('Solution Deleted', data))
        .catch(err => console.log(err, 'Error Occured during delete'))
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
        }else {
            setLoading(true)
        }
    }, [data])

    useEffect(()=> {
        if (Object.keys(currentUserVal).length > 2) {
            setCurrentUser(currentUserVal)
            console.log('if entered')
            setLoading(false)
        }else {
            
            console.log('loading......')
        }
    },[currentUserVal])

    
    console.log(loading,'loading....', sortNames)
    return (<>
        <h1>Get Task:</h1>
    {
        loading ? <h3>Loading....</h3> : <div>
        <table border='1' cellPadding={10}>
            <thead>
                <tr>
                    <th>Sl. No</th>
                    <th><div>Developer Name</div>
                    <select onClick={handleClick} name='dName'>
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
                    <select onClick={handleClick} name='cName'>
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
                        <select onClick={handleClick} name='technology'>
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
                    <th>Issue</th>
                    <th>Date</th>
                    <th>Image</th>
                    <th>Edit / Delete</th>
                </tr>
            </thead>
            <tbody>
                {
                  tableData.length ? <>{
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
                                    <button onClick={() => editFunc(val._id)} disabled={currentUser.mobile !== val.mobile}>Edit</button>
                                    <button onClick={() => deleteFunc(val._id)} disabled={currentUser.mobile !== val.mobile}>Delete</button>
                                </td>
                            </tr>
                        )
                    })
                }
                  </>  :<tr>
                    <td colSpan={8}> Loading......</td>
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