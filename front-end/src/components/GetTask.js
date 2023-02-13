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
        technologies:[]
    })
    
    const sortList =()=> {
        sortNames.dName = [...new Set(data.map(val => val.dName))]
        sortNames.cName = [...new Set(data.map(val=> val.cName))]
        sortNames.technologies = [...new Set(data.map(val => val.technology))]
    }

    const handleClick = (e) => {
        const { name, value } = e.target
        console.log(name, value)
         let sortData =  data.filter(val => value !== 'All' ? val.technology === value : value)
        // switch(name) {
        //     case "dName" {

        //     }
        // }
        // let sortData =  data.filter(val => {
        //     switch (name) {
        //         case 'dName': {
        //             if (val.dName == value ){
        //                 return val
        //             }
        //         }
        //     }
        // })
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
    useEffect(() => {
        if (data.length) {
            setTableData(data)
            setLoading(false)
            sortList()
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

    useEffect(() => {
        axios.get('/api/getData')
            .then(data => setData(data.data))
            .catch(err => console.log(err, 'err'))
    }, [])
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
                            <option>All</option>
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
                            <option>All</option>
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
                            <option>All</option>
                            {
                                sortNames.technologies.map((val, idx) => {
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
    }
    </>
        
    )
}

export default GetTask