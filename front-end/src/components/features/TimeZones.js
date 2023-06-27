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
            <div className='bg-warning rounded p-1'>CST : {timeByZones.CST}</div>
            <div className='bg-secondary rounded p-1'>EST : {timeByZones.EST}</div>
        </div>
    )
}
const getTimeZone = (tz) => {
    switch (tz) {
        case 'CA' : {
            return 'Chicago'
        }
        case 'LA' : {
            return 'Los_Angeles'
        }
        case 'NY' : {
            return 'New_York'
        }
        default : return  'New_York'
    }
}
export const ParticularTimeZone = ({timeZone})=> {
    const tz = getTimeZone(timeZone)
    const [timeByZone, setTimeByZone] = useState(new Date().toLocaleTimeString('en-US', { timeZone: `America/${tz}`  }))
    useEffect(()=> {
        setInterval(()=> {
            const d = new Date()
            const tm = d.toLocaleTimeString('en-US', { timeZone: `America/${tz}`})
            setTimeByZone(tm)
        },1000)
    },[])

    return <>{timeByZone}</>
}

export default TimeZones