import React from 'react'
import { useLocation } from 'react-router-dom'

const Description = () => {
    const location = useLocation()
    const data = location.state
    if (!data){
        return ''
    }
    console.log('params', location)
  return (
    <div>
        <h2>Client Name : {data.cName}</h2>
        <h2>Technology : {data.technology}</h2>
        <h2>Issue : {data.issue}</h2>
        <h2>Description: {data.issue}</h2>
    </div>
  )
}

export default Description