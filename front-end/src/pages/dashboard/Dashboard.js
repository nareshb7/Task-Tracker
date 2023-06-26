import React, { useContext, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import MaintanancePage from '../MaintanancePage'
import AdminDashboard from './AdminDashboard'
import { UserContext } from '../../App'
import UserDashboard from './UserDashboard'
import './Dashboard.css'

const Dashboard = () => {
    const { currentUserVal, socket } = useContext(UserContext)
    const [render, setRender] = useState(false)
    return <div>
        <Col>
            <MaintanancePage />
            <Row>
                <Col>
                    <span className='fw-bold fs-1 text-primary'>Welcome Back, {currentUserVal.fName}</span>
                </Col>
                <Col>
                    <Button onClick={() => setRender(e => !e)}>Refresh <i className='fas fa-refresh'></i></Button>
                </Col>
            </Row>
            {
                currentUserVal.isAdmin ?
                    <AdminDashboard currentUserVal={currentUserVal} socket={socket} /> :
                    <UserDashboard currentUserVal={currentUserVal} />
            }
        </Col>
    </div>
}
export default Dashboard