import axios from 'axios'
import React, {useState} from 'react'
import { useLocation } from 'react-router-dom'

const Description = () => {
    const location = useLocation()
    const data = location.state
    const [newSolution, setNewSolution] = useState('')
    const [addSolutionShow, setAddSolutionShow] = useState(false)
    if (!data){
        return ''
    }
    const addAnswer =()=> {
      console.log(newSolution, 'solution')
      axios.post('/api/addSolution', {newData : [...data.solutions, newSolution], id: data._id})
      .then(data => console.log(data, 'sucess'))
      .catch(err => console.log(err, 'err'))
    }
  return (
    <div style={{display:'flex', justifyContent:'space-around'}}>
      <div>
        <h2>Client Name : {data.cName}</h2>
        <h2>Technology : {data.technology}</h2>
        <h2>Issue : {data.issueTitle}</h2>
        <h2>Description: {data.issue}</h2>
        <h2>Solutions : </h2>
        {
          data?.solutions.map((solution, idx)=> {
            return (
              <h4 key={idx}>{solution}</h4>
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