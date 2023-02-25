import axios from 'axios'
import React, {useState, useContext} from 'react'
import { useLocation } from 'react-router-dom'
import { UserContext } from '../../App'

const Description = () => {
  const {currentUserVal} = useContext(UserContext)
    const location = useLocation()
    const [data, setData] = useState(location.state)
    const [newSolution, setNewSolution] = useState('')
    const [addSolutionShow, setAddSolutionShow] = useState(false)
    if (!data){
        return ''
    }
    const addAnswer =()=> {
      const d = new Date()
      const devName = currentUserVal.fName +" "+ currentUserVal.lName
      console.log(devName)
      
      axios.post('/api/addSolution', {newData : [...data.solutions, {solution: newSolution, updatedTime: d, uploadedBy: devName, devId: currentUserVal._id }], id: data._id})
      .then(res => {
        setData(res.data)
        setNewSolution('')
      })
      .catch(err => console.log(err, 'err'))
    }
    console.log(data, 'data')
  return (
    <div style={{display:'flex', justifyContent:'space-around'}}>
      <div>
        <h2>Client Name : <span>{data.cName}</span></h2>
        <h2>Technology : <span>{data.technology}</span></h2>
        <h2>Posted on : <span>{new Date(data.time).toLocaleString()}</span></h2>
        <h2>Issue : <span>{data.issueTitle}</span></h2>
        <h2>Description: <span>{data.issue}</span></h2>
        <h2>Solutions : </h2>
        {
          data?.solutions.map((solution, idx)=> {
            return (
              <h4 key={idx}>{idx +1 }: <span>{solution?.solution}</span> - {solution?.updatedTime ? <span>added on {new Date(solution.updatedTime).toLocaleString()}</span>: 'Initial Solution'} by : {solution.uploadedBy ? solution.uploadedBy : data.dName}</h4>
            )
          })
        }
        <div style={{width:'300px', height:'300px'}}>
          <img src={data.binaryData} style={{width:'100%' , height:'100%'}}/>
        </div>
      </div>
      <div>
        <button onClick={()=> setAddSolutionShow(!addSolutionShow)} >Add Answer</button>
        <div style={{visibility: `${addSolutionShow ? 'visible': 'hidden'}`}}><div style={{marginBlock:'10px'}}>
          <textarea placeholder='Add Slution here....' rows={6} cols='50' value={newSolution} onChange={(e)=> setNewSolution(e.target.value)}></textarea>
        </div>
        <div>
        <button onClick={addAnswer}>Submit for Approval</button>
        </div>
        </div>
        
      </div>
    </div>
  )
}

export default Description