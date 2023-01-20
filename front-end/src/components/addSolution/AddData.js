import React, {useState} from 'react'
import axios from 'axios'

const AddData = () => {
    const technologies =["React", "Angular", "JavaScript", "CSS"]
    const [data,setData] = useState({
        dName:'',
        cName:'',
        technology:'React',
        issue:'',
        time :''
    })
    
    const handleSubmit =(e)=> {
        e.preventDefault()
        console.log(data, 'data')
        data.time = new Date().toLocaleString()
        axios.post("http://localhost:4040/setData", {data: data})
        .then(data => console.log(data, 'data'))
        .catch(err => console.log(err, 'err'))
    }
    const handleChange =(e)=> {
        const {name, value} = e.target
        setData({...data, [name]:value})
        console.log(name, value)
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
                        <select name='technology' defaultValue="React" onChange={handleChange}>
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
                    <textarea name='issue' onChange={handleChange}></textarea>
                </div>
                <div>
                    <button type='submit'>Add Data</button>
                </div>
            </form>
        </div>
    )
}

export default AddData