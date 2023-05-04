import React from 'react'
import { Col, Row } from 'react-bootstrap'
import Maintanance from './MaintanancePage'

const Dashboard = ()=> {
    return <Row>
        <Col>
            <Maintanance />
            {/* <p className='text-center fw-bolder fs-1'>DashBoard Component</p> */}
        </Col>
    </Row>
}
export default Dashboard