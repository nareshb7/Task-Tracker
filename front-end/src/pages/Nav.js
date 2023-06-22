import React, { useContext, useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Container, NavDropdown, Nav, Button } from 'react-bootstrap'
import { UserContext } from '../App'
// import { GreenDot, RedDot } from '../utils/Dots/Dots'
// import { BE_URL } from '../utils/Constants'
// import { fetchCall } from '../utils/fetch/UseFetch'
import { logoutFunc } from '../components/utils/LogoutFunc'
import { setCookie } from '../components/utils/CookieComp'
import '../pages/chatBox/ChatBox.css'
import Time from '../components/utils/Time'
import './style/Navigation.css'
import { addActivity } from './activityPage/ActivityPage'

const Navigation = () => {
    const { currentUserVal, setCurrentUserVal, socket, notificationRooms } = useContext(UserContext)

    const navigate = useNavigate()
    const logout = async (id) => {
        addActivity(currentUserVal, 'Nav page', `Logged out`)
        await logoutFunc(currentUserVal)
        setCookie("63dab3b51d791ebc7821db51", 2)
        setCurrentUserVal({})
        socket.emit('new-user')
        navigate('/login')
    }

    const handleStatus = async (e) => {
        const val = e.target.checked
        if (val) {
            await logoutFunc(currentUserVal, 'Online')
            setCurrentUserVal({ ...currentUserVal, status: 'Online' })
        } else {
            await logoutFunc(currentUserVal)
            setCurrentUserVal({ ...currentUserVal, status: 'Offline' })
        }
        socket.emit('new-user')
        addActivity(currentUserVal, 'Nav page', `Changed Login Status to ${val ? 'Online': 'Offline'}`)
    }

    return (
        <Navbar bg="dark" variant='dark' expand="lg">
            <Container fluid>
                <LinkContainer to='/'>
                    <Navbar.Brand >Task- Tracker</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto ">
                        <LinkContainer to='/'>
                            <Nav.Link >Home</Nav.Link>
                        </LinkContainer>
                        {/* <LinkContainer to='/addIssue'>
                            <Nav.Link >Add Ticket</Nav.Link>
                        </LinkContainer> */}
                        <LinkContainer to='/getIssue'>
                            <Nav.Link >Tickets</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/adminpage'>
                            <Nav.Link >Admin Page</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/chat'>
                            <Nav.Link >Chat
                                {currentUserVal._id && notificationRooms != 0 && <span className='notification-icon'>{notificationRooms}</span>}
                            </Nav.Link>
                        </LinkContainer>
                        {
                            currentUserVal.fName &&
                            <LinkContainer to='/dashboard'>
                                <Nav.Link>Dashboard</Nav.Link>
                            </LinkContainer>
                        }

                        {
                            currentUserVal.fName && <li>
                                <label className="switch mt-2">
                                    <input type="checkbox" onChange={handleStatus} defaultChecked={true} />
                                    <span className="slider round"></span>
                                </label>
                            </li>
                        }
                        <LinkContainer to='/login'>
                            <Nav.Link > {currentUserVal.mobile ? "My  Profile" : "Login"}</Nav.Link>
                        </LinkContainer>
                        {
                            currentUserVal.fName && (
                                <NavDropdown title={
                                    <>
                                        <img src={currentUserVal.binaryData} style={{ width: 30, height: 30, marginRight: 10, objectFit: 'cover', borderRadius: '50%' }} />
                                        {currentUserVal.fName} {currentUserVal.lName}
                                    </>
                                } id="basic-nav-dropdown">
                                    <NavDropdown.Item>
                                        <Button variant='danger' onClick={() => logout(currentUserVal._id)}>Logout </Button>
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )
                        }
                        <Nav.Link>
                            <Time />
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
export default Navigation