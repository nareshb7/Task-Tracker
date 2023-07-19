import React, { useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Container, NavDropdown, Nav, Button } from 'react-bootstrap'
import { UserContext } from '../App'
import { logoutFunc } from '../components/utils/LogoutFunc'
import { setCookie } from '../components/utils/CookieComp'
import '../pages/chatBox/ChatBox.css'
import Time from '../components/utils/Time'
import './style/Navigation.css'
import { addActivity } from './activityPage/ActivityPage'
import logo from '../assets/company-logo.jpg'

const Navigation = () => {
    const { currentUserVal, setCurrentUserVal, socket, notificationRooms, isLoggedIn, setIsLoggedIn } = useContext(UserContext)

    const navigate = useNavigate()
    const logout = async (id) => {
        addActivity(currentUserVal, 'Nav page', `Logged out`)
        await logoutFunc(currentUserVal)
        setCookie("63dab3b51d791ebc7821db51", 2)
        setCurrentUserVal({})
        socket.emit('new-user')
        setIsLoggedIn(false)
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
        addActivity(currentUserVal, 'Nav page', `Changed Login Status to ${val ? 'Online' : 'Offline'}`)
    }

    return (
        <Navbar bg="dark" variant='dark' expand="lg" className='p-0'>
            <Container fluid>
                <LinkContainer to='/'>
                    <Navbar.Brand className='nav-logo'>
                        <img className="logo" src={logo} alt='cmpnyLogo' />
                        Task- Tracker</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto ">
                        <LinkContainer to='/'>
                            <Nav.Link >Home</Nav.Link>
                        </LinkContainer>
                        {
                            isLoggedIn && <>
                                <LinkContainer to='/tickets'>
                                    <Nav.Link >Tickets</Nav.Link>
                                </LinkContainer>
                                {
                                    currentUserVal.isAdmin && <LinkContainer to='/adminpage'>
                                        <Nav.Link >Admin Page</Nav.Link>
                                    </LinkContainer>
                                }
                                <LinkContainer to='/chat'>
                                    <Nav.Link >Chat
                                        {notificationRooms != 0 && <span className='notification-icon'>{notificationRooms}</span>}
                                    </Nav.Link>
                                </LinkContainer>
                                <LinkContainer to='/dashboard'>
                                    <Nav.Link>Dashboard</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to='/profile'>
                                    <Nav.Link>My Profile</Nav.Link>
                                </LinkContainer>
                                <li>
                                <label className="switch mt-2">
                                    <input type="checkbox" onChange={handleStatus} defaultChecked={true} />
                                    <span className="slider round"></span>
                                </label>
                            </li>
                            </>
                        }
                        {
                            !isLoggedIn && <LinkContainer to='/login'>
                            <Nav.Link >Login</Nav.Link>
                        </LinkContainer>
                        }
                        {
                            isLoggedIn && (
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