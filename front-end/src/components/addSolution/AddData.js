import React, {useState} from 'react'
import axios from 'axios'

const AddData = () => {
    const technologies =["React", "Angular", "JavaScript", "CSS"]
    const [status, setStatus] = useState('')
    const obj ={
        dName:'',
        cName:'',
        technology:'React',
        issue:'',
        time :''
    }
    const [data,setData] = useState(obj)
    const handleSubmit =(e)=> {
        e.preventDefault()
        data.time = new Date().toLocaleString()
        axios.post("http://localhost:4040/setData", {data: data})
        .then(data => setStatus('Data Added Sucessfully'))
        .catch(err => setStatus(`Error Occured : ${JSON.stringify(err)}`))
        setData(obj)
    }
    const handleChange =(e)=> {
        const {name, value} = e.target
        setData({...data, [name]:value})
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        <span>Enter Developer Name :</span>
                        <input type='text' name='dName' value={data.dName} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        <span>Enter Client Name :</span>
                        <input type='text' name='cName' value={data.cName} onChange={handleChange} />
                    </label>
                </div>
                <div>
                    <label>
                        <span>Mention the Technology</span>
                        <select name='technology' value={data.technology} onChange={handleChange}>
                            {
                                technologies.map((val, idx) => {
                                    return (
                                        <option key={idx} value={val}>{val}</option>
                                    )
                                })
                            }
                        </select>
                    </label>
                </div>
                <div>
                    <textarea name='issue' onChange={handleChange} value={data.issue}></textarea>
                </div>
                <div>
                    <button type='submit'>Add Data</button>
                </div>
            </form>
            <div>
                <h3>Status : {status}</h3>
            </div>
        </div>
    )
}

export default AddData