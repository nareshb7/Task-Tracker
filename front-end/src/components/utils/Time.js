import React, { useState } from 'react'

const Time = ()=> {
    const [d,setD] = useState('')
    setInterval(()=> {
        const d = new Date().toLocaleTimeString()
        setD(d)
    },1000)
    return (
        <div><b>{d} </b></div>
    )
}
export default Time