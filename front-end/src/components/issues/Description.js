import React, { useState, useContext, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { UserContext } from '../../App'
import { fetchCall } from '../utils/fetch/UseFetch'
import { GreenDot, RedDot } from '../utils/Dots/Dots'

const Description = () => {
  const { currentUserVal } = useContext(UserContext)
  const location = useLocation()
  const [data, setData] = useState(location.state)
  const [newSolution, setNewSolution] = useState('')
  const [solutions, setSolutions] = useState([])
  const [addSolutionShow, setAddSolutionShow] = useState(false)
  useEffect(() => {
    const getIssue = async () => {
      let result = await fetchCall('api/getParticularSolution', { id: data._id })
      if (result.solutions) {
        setData(result)
        setSolutions(result.solutions.reverse())
      }
    }
    getIssue()
  }, [data])
  if (!data) {
    return ''
  }

  const addAnswer = async () => {
    const d = new Date()
    const devName = currentUserVal.fName + " " + currentUserVal.lName
    const apiPayload = { newData: [...data.solutions, { solution: newSolution, updatedTime: d, uploadedBy: devName, devId: currentUserVal._id }], id: data._id }
    let response = await fetchCall('api/addSolution', apiPayload)
    if (response._id) {
      setData(response)
      setNewSolution('')
    } else {
      console.log('error', response)
    }
    // axios.post('/api/addSolution', {newData : [...data.solutions, {solution: newSolution, updatedTime: d, uploadedBy: devName, devId: currentUserVal._id }], id: data._id})
    // .then(res => {
    //   setData(res.data)
    //   setNewSolution('')
    // })
    // .catch(err => console.log(err, 'err'))
  }
  const addAnswerFunc = () => {
    if (currentUserVal.fName) {
      setAddSolutionShow(!addSolutionShow)
    } else {
      alert('Please Login ')
    }
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div>
        <h2>Client Name : <span>{data.cName}</span></h2>
        <h2>Technology : <span>{data.technology}</span></h2>
        <h2>Posted on : <span>{new Date(data.time).toLocaleString()}</span></h2>
        <h2>Issue : <span>{data.issueTitle}</span> {data.issueStatus === 'Resolved' ? <GreenDot /> : <RedDot />} </h2>
        <h2>Description: <span>{data.issue}</span></h2>
        <h2>Solutions : </h2>
        {
          solutions.map((solution, idx) => {
            return (
              <h4 key={idx}>{idx + 1}: <span style={{ color: "#888" }}>{solution.uploadedBy ? solution.uploadedBy : data.dName}</span> :  <span>{solution?.solution}</span> -
                {solution?.updatedTime ?
                  <span>added on {new Date(solution.updatedTime).toLocaleString()}</span>
                  : 'Initial Solution'}
              </h4>
            )
          })
        }
        <div style={{ width: '300px', height: 'auto' }}>
          {
            Array.isArray(data.binaryData) ? data.binaryData.map((imgFile, idx) => <img key={idx} src={imgFile} style={{ width: '100%', height: '100%' }} />) :
              <img src={data.binaryData} style={{ width: '100%', height: '100%' }} />
          }
        </div>
      </div>
      <div>
        <button title='U can add data only after login' onClick={() => addAnswerFunc()} >Add Answer</button>
        <div style={{ visibility: `${addSolutionShow ? 'visible' : 'hidden'}` }}><div style={{ marginBlock: '10px' }}>
          <textarea placeholder='Add Solution here....' rows={6} cols='50' value={newSolution} onChange={(e) => setNewSolution(e.target.value)}></textarea>
        </div>
          <div>
            <button onClick={addAnswer}>Submit</button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Description