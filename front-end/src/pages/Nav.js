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

const Navigation = () => {
    const { currentUserVal, setCurrentUserVal, socket } = useContext(UserContext)
    const navigate = useNavigate()
    const logout = async (id) => {
        await logoutFunc(currentUserVal)
        setCookie("63dab3b51d791ebc7821db51", 2)
        setCurrentUserVal({})
        navigate('/login')
        socket.emit('new-user')
    }
    const handleStatus = async (e) => {
        if (e.target.checked) {
            await logoutFunc(currentUserVal, 'Online')
            setCurrentUserVal({ ...currentUserVal, status: 'Online' })
        } else {
            await logoutFunc(currentUserVal)
            setCurrentUserVal({ ...currentUserVal, status: 'Offline' })
        }
        socket.emit('new-user')
    }
    // return (
    //     <Navbar bg="light" expand="lg">
    //   <Container>
    //     <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
    //     <Navbar.Toggle aria-controls="basic-navbar-nav" />
    //     <Navbar.Collapse id="basic-navbar-nav">
    //       <Nav className="me-auto">
    //         <Nav.Link href="#home">Home</Nav.Link>
    //         <Nav.Link href="#link">Link</Nav.Link>
    //         <NavDropdown title="Dropdown" id="basic-nav-dropdown">
    //           <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
    //           <NavDropdown.Item href="#action/3.2">
    //             Another action
    //           </NavDropdown.Item>
    //           <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
    //           <NavDropdown.Divider />
    //           <NavDropdown.Item href="#action/3.4">
    //             Separated link
    //           </NavDropdown.Item>
    //         </NavDropdown>
    //       </Nav>
    //     </Navbar.Collapse>
    //   </Container>
    // </Navbar>
    // )

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <LinkContainer to='/'>
                    <Navbar.Brand >Task- Tracker</Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto ">
                        <LinkContainer to='/'>
                            <Nav.Link >Home</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/addIssue'>
                            <Nav.Link >Add Issue</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/getIssue'>
                            <Nav.Link >IssueList</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/adminpage'>
                            <Nav.Link >Admin Page</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/chat'>
                            <Nav.Link >Chat</Nav.Link>
                        </LinkContainer>
                        <li>
                            <label className="switch">
                                <input type="checkbox" onChange={handleStatus} defaultChecked={true} />
                                <span className="slider round"></span>
                            </label>
                        </li>
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
                    </Nav>

                </Navbar.Collapse>
                {/* <nav>
            <ul style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <li>
                        <img src='' alt='' />
                        Task-Tracker
                    </li>
                    <li><NavLink to='/'>Home </NavLink> </li>
                    <li><NavLink to='addIssue'>Add Issue</NavLink> </li>
                    <li><NavLink to='getIssue'>Issue's List</NavLink> </li>
                    <li><NavLink to='adminpage'>Admin Page </NavLink> </li>
                    <li><NavLink to='/chat' >Members</NavLink> </li>
                    <li>DB : {be.db == 200 ? <GreenDot /> : <RedDot />}</li>
                    <li>Server : {be.server == 200 ? <GreenDot /> : <RedDot />}</li>
                    <li><label className="switch">
                        <input type="checkbox" onChange={handleStatus} defaultChecked={true} />
                            <span className="slider round"></span>
                    </label> </li>
                </div>
                <div>
                    <li><NavLink to='login'>{currentUserVal.mobile ? "My  Profile" : "Login"}</NavLink> </li>
                    <li style={{ display: `${currentUserVal.mobile ? 'none' : 'inline-block'}` }}><NavLink to='signup'>Sign Up</NavLink> </li>
                    <li><h3 style={{ marginBlock: '0' }}>{currentUserVal.status == 'Online' ? <GreenDot/> : <RedDot/>} {currentUserVal.hasOwnProperty('fName') && currentUserVal.fName + " " + currentUserVal.lName} </h3></li>
                    <li style={{ display: `${currentUserVal.mobile ? 'inline-block' : 'none'}` }}><button onClick={() => logout(currentUserVal._id)}>LogOut </button> </li>
                    <li><button onClick={() => navigate(-1)}>Back</button></li>
                </div>
            </ul>
        </nav> */}
            </Container>
        </Navbar>
    )
}
export default Navigation