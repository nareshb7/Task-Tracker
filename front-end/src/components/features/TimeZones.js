import React, { useEffect, useState } from 'react'

const TimeZones = () => {
    const [timeByZones, setTimeByZones] = useState({
        EST: new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' }),
        PST: new Date().toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles' }),
        CST: new Date().toLocaleTimeString('en-US', { timeZone: 'America/Chicago' })
    })
    useEffect(() => {
        setInterval(() => {
            const d = new Date()
            const EST = d.toLocaleTimeString('en-US', { timeZone: 'America/New_York' })
            const CST = d.toLocaleTimeString('en-US', { timeZone: 'America/Chicago' })
            const PST = d.toLocaleTimeString('en-US', { timeZone: 'America/Los_Angeles' })
            setTimeByZones({ EST, CST, PST })
        }, 1000)
        return ()=> clearInterval()
    }, [])


    return (
        <div className='fs-3 fw-bolder d-flex gap-4 align-items-center'>
            <div className='bg-primary rounded p-1'>PST : {timeByZones.PST}</div>
            <div className='bg-secondary rounded p-1'>EST : {timeByZones.EST}</div>
            <div className='bg-warning rounded p-1'>CST : {timeByZones.CST}</div>
        </div>
    )
}

export default TimeZones