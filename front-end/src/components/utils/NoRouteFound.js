import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const NoRouteFound = () => {
    const navigate= useNavigate()
    useEffect(()=> {
        setTimeout(()=> {
            navigate('/')
        },3000)
        return ()=> {
            clearTimeout()
        }
    },[])
  return (
    <Row>
        <Col className='fw-bold fs-3 text-center d-flex flex-column card m-1'>
            <span>No Route Found</span>
            <span>Page will redirect to home page in 3 sec's</span>
        </Col>
    </Row>
  )
}

export default NoRouteFound