import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

const NoRouteFound = () => {
    const navigate= useNavigate()
  return (
    <Row>
        <Col className='fw-bold fs-3 text-center d-flex flex-column card m-1'>
            <span>No Route Found</span>
            <span>click here to go to <Link to='/'>home page</Link> </span>
        </Col>
    </Row>
  )
}

export default NoRouteFound