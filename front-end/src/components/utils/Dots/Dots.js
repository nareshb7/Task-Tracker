import React from 'react'

export const GreenDot = ({title}) => {
  return (
    <span title={title}  style={{ background:'#0f0', height:'15px', width:'15px', display:'inline-block', borderRadius:'50%'}}></span>
  )
}

export const RedDot = ({title}) => {
  return (
    <span title={title} style={{ background:'#f00', height:'15px', width:'15px', display:'inline-block', borderRadius:'50%'}}></span>
  )
}
