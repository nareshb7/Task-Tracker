import React, { useContext} from 'react'
import { Col, Row } from 'react-bootstrap'
import MaintanancePage from './MaintanancePage'
import AdminDashboard from './AdminDashboard'
import { UserContext } from '../App'
import UserDashboard from './UserDashboard'

const Dashboard = () => {
    const {currentUserVal, socket} = useContext(UserContext)
    return <Row>
        <Col>
            <MaintanancePage />
            <span className='fw-bold fs-1 text-primary'>Welcome Back, {currentUserVal.fName}</span>
            {
                currentUserVal.isAdmin ? 
                <AdminDashboard currentUserVal={currentUserVal} socket={socket} /> : 
                <UserDashboard currentUserVal={currentUserVal}/>
            }            
        </Col>
    </Row>
}
export default Dashboard