import React, { useEffect, useState } from 'react'

const Time = ()=> {
    const [d,setD] = useState('')
    useEffect(()=> {
       const interval = setInterval(()=> {
            const d = new Date().toLocaleTimeString()
            setD(d)
        },1000)
        return ()=> clearInterval(interval)
    },[])
    return (
        <div><b>{d} </b></div>
    )
}
export default Time